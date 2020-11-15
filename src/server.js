// server dependencies
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookie from 'cookie';
import compression from 'compression';
import * as sapper from '@sapper/server';

// database
import Knex from 'knex';
import addModels, * as db from '../database';

// filesystem
import path from 'path';
import fs from 'fs';

// utilities
import _ from 'lodash';
import getUser from "../utils/getUser";
import getRouteName from '../utils/getRouteName';

dotenv.config();

// bookshelf instance
const knex = new Knex({
  client: process.env.DB_CLIENT || 'mysql',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'main',
    charset: process.env.DB_CHARSET || 'utf8'
  }
});

// working with filesystem
const srcPath = path.join(process.cwd(), 'src');
const modelsPath = path.join(srcPath, 'api');
const configPath = path.join(srcPath, 'config');

// environment
const { PORT, NODE_ENV, API_URL = 'http://localhost:3000/api' } = process.env;
const dev = NODE_ENV === 'development';

/**
 * Global variable containing server cache, plugins, models, functions
 * @returns JS object
 */
global.wonder = {};
wonder.knex = knex;

function _send(payload = {}, statusCode = 200) {
  this.statusCode = statusCode;

  this.end(JSON.stringify({
    response: payload
  }));
}

function _throw(statusCode = 400) {
  this.statusCode = statusCode;
  this.end('{}');
}

/**
 * Main function of the server.
 */
const main = () => {
  // proceed if connected to database
  knex.raw('select 1 + 1 as testValue').then(() => {
    fs.readdir(modelsPath, (err, files) => {
      if (err) {
        console.log('You have no API. I don\'t want to start the server.');
        return;
      };

      wonder.models = [];
      wonder.paths = {};
      wonder.services = {};
      wonder.cache = {};

      Promise.all(
        files.map(file => new Promise((resolve, reject) => {
          let currentPath = path.join(modelsPath, file),
            modelPath = path.join(currentPath, 'model.js'),
            servicesPath = path.join(currentPath, 'services.js'),
            routesPath = path.join(currentPath, 'routes.json'),
            controllersPath = path.join(currentPath, 'controllers.js'),
            routeName = getRouteName(file);

          Promise.all([
            new Promise((resolve, reject) => {
              fs.access(modelPath, fs.F_OK, err => {
                if (err) {
                  resolve();
                  return;
                }

                const model = require(modelPath);
                wonder.models.push(model);

                if (file.toLowerCase() === 'user') {
                  wonder
                    .knex('user')
                    .count('id')
                    .then(count => {
                      wonder.cache.usersCount =
                        count[0][Object.keys(count[0])[0]];

                      resolve();
                    });
                } else {
                  resolve();
                }
              });
            }),
            new Promise((resolve, reject) => {
              fs.access(routesPath, fs.F_OK, err => {
                if (err) {
                  resolve();
                  return;
                }

                fs.access(controllersPath, fs.F_OK, err => {
                  let routes = require(routesPath),
                    controllers = require(controllersPath);

                  for (let j = 0; j < routes.length; j += 1) {
                    routes[j].method = routes[j].method.toUpperCase();

                    if (
                      routes[j].path.charAt(
                        routes[j].path.length - 1
                      ) !== '/'
                    ) {
                      routes[j].path += '/';
                    }

                    const routePath = `/${routeName}${routes[j].path}`;

                    _.set(wonder.paths, [
                      routes[j].method,
                      routePath,
                      'policies'
                    ], []);

                    if (routes[j].hasOwnProperty('config')) {
                      if (routes[j].config.hasOwnProperty('policies')) {
                        for (let policy of routes[j].config.policies) {
                          wonder
                            .paths
                          [routes[j].method]
                          [routePath]
                            .policies
                            .push(wonder.policies[policy]);
                        }
                      }
                    }

                    _.set(
                      wonder.paths,
                      [
                        routes[j].method,
                        routePath,
                        'handler'
                      ],
                      (
                        routes[j].handler === 'default' ?
                          controllers :
                          controllers[routes[j].handler]
                      )
                    );

                    resolve();
                  }
                });
              });
            }),
            new Promise((resolve, reject) => {
              fs.access(servicesPath, fs.F_OK, err => {
                if (err) {
                  resolve();
                  return;
                }

                wonder.services[_.camelCase(file)] = require(servicesPath);
                resolve();
              });
            })
          ]).then(resolve, e => console.log(e));
        }))
      )
        .then(() => addModels(knex, wonder.models))
        .then(() => {
          // Set Query function
          wonder.query = db.query;
          wonder.queryAll = db.queryAll;

          const app = express();

          app
            .use(bodyParser.json({ extended: true }))
            .use(async (req, res, next) => {
              const start = new Date();

              await next();

              const ms = Date.now() - start.getTime();

              console.log(
                `${start.toLocaleString()} | ${res.statusCode} ` +
                `${req.method} on ${req.originalUrl} took ${ms} ms`
              );
            })
            .use('/api', async (req, res, next) => {
              req.cookies = cookie.parse(req.headers.cookie || '');
              req.search = req.url.substring(req.path.length + 1);

              res.throw = _throw;

              const path = (
                req.path[req.path.length - 1] === '/' ?
                  req.path :
                  req.path + '/'
              );

              if (
                wonder.paths.hasOwnProperty(req.method) &&
                wonder.paths[req.method].hasOwnProperty(path)
              ) {
                try {
                  res.send = _send;

                  responseHandling: {
                    for (
                      const policy of
                      wonder.paths[req.method][path].policies
                    ) {
                      await policy(req, res);

                      if (res.headersSent) {
                        break responseHandling;
                      }
                    };

                    await wonder
                      .paths
                      [req.method]
                      [path]
                      .handler(req, res);
                  }
                } catch (e) {
                  console.log(e);

                  res.throw(500);
                }
              } else {
                res.throw(404);
              }

              return;
            })
            .use(compression({ threshold: 0 }))
            .use(express.static('static'))
            .use(async (req, res, next) => {
              req.cookies = cookie.parse(req.headers.cookie || '');

              req.user = await getUser(req.cookies.jwt);

              sapper.middleware({
                session: () => {
                  return {
                    apiUrl: API_URL,
                    user: (
                      req.user ?
                        Object.assign({
                          isAuthenticated: true
                        }, _.pick(req.user, [
                          'first_name',
                          'last_name',
                          'username',
                          'permissions'
                        ])) :
                        {
                          isAuthenticated: false
                        }
                    )
                  };
                }
              })(req, res, next);
            });

          app.listen(PORT, err => {
            if (err) console.log('error', err);
          });
        })
        .catch(e => console.log(e));
    });
  });
};

fs.access(configPath, fs.F_OK, err => {
  if (err) main();

  const bootstrapPath = path.join(
    configPath,
    'functions',
    'bootstrap.js'
  );
  const policiesPath = path.join(
    configPath,
    'functions',
    'policies'
  );
  const commonEnvironmentPath = path.join(
    configPath,
    'environments',
    'common.js'
  );
  const specialEnvironmentPath = (
    dev ?
      path.join(configPath, 'environments', 'development.js') :
      path.join(configPath, 'environments', 'production.js')
  );

  Promise.all([
    new Promise((resolve, reject) => {
      fs.access(specialEnvironmentPath, fs.F_OK, err => {
        if (!err) {
          const specialConfig = require(specialEnvironmentPath);

          if (wonder.config) {
            wonder.config = _.defaults(specialConfig, wonder.config);
          } else {
            wonder.config = specialConfig;
          }
        }

        resolve();
      });
    }),
    new Promise((resolve, reject) => {
      fs.access(commonEnvironmentPath, fs.F_OK, err => {
        if (!err) {
          const commonConfig = require(commonEnvironmentPath);

          if (wonder.config) {
            wonder.config = _.defaults(wonder.config, commonConfig);
          } else {
            wonder.config = commonConfig;
          }
        }

        resolve();
      });
    }),
    new Promise((resolve, reject) => {
      fs.readdir(policiesPath, (err, files) => {
        wonder.policies = {};

        if (!err) {
          for (const file of files) {
            const filePath = path.join(policiesPath, file);

            wonder.policies[file.replace(/\.[^/.]+$/, "")] =
              require(filePath);
          }
        }

        resolve();
      })
    })
  ])
    .then(() => {
      fs.access(bootstrapPath, fs.F_OK, err => {
        if (err) main();

        require(bootstrapPath)().then(main);
      });
    });
});