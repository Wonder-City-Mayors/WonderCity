// server dependencies
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookie from 'cookie';
import compression from 'compression';
import http from 'http';
import * as sapper from '@sapper/server';

// database
import Knex from 'knex';
import addModels, * as db from '../database';

// filesystem
import path from 'path';
import { readFile, access, readdir } from 'filesystem';
import fs from 'fs';

// utilities
import _ from 'lodash';
import getUser from 'getUser';
import getRouteName from 'getRouteName';

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

// environment
const { PORT, NODE_ENV, API_URL = 'http://localhost:3000/api' } = process.env;
const dev = NODE_ENV === 'development';

// working with filesystem
const configPath = path.resolve(process.cwd(), 'src', 'config');
const apiPath = path.resolve(process.cwd(), 'src', 'api');
const functionsPath = path.join(configPath, 'functions');
const environmentsPath = path.join(configPath, 'environments')
const bootstrapPath = path.join(functionsPath, 'bootstrap.js');
const policiesPath = path.join(functionsPath, 'policies');
const commonEnvironmentPath = path.join(environmentsPath, 'common.js');
const specialEnvironmentPath = path.join(environmentsPath,
  dev ? 'development.js' : 'production.js'
);
const chunksPath = path.resolve(
  process.cwd(),
  '__sapper__',
  dev ? 'dev' : 'build',
  'server'
);

/**
 * Global variable containing server cache, plugins, models, functions
 * @returns JS object
 */
let wonderSpecs;
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
  knex.raw('select 1 + 1 as testValue')
    .then(() => readdir(apiPath))
    .then(files => {
      wonder.models = [];
      wonder.paths = {};
      wonder.services = {};
      wonder.cache = {
        connectedUsers: {}
      };

      return Promise.all(
        files.map(file => new Promise((resolve, reject) => {
          const routeName = getRouteName(file);

          const modelPath = path.join(
            chunksPath,
            `route`
          )
          const promiseArray = [];

          if (wonderSpecs.routes.hasOwnProperty(routeName)) {
            const routesPath = path.join(
              chunksPath,
              `routes-${wonderSpecs.routes[routeName]}.js`
            );
            const controllersPath = path.join(
              chunksPath,
              `controllers-${wonderSpecs.controllers[routeName]}.js`
            );

            console.log(routesPath, controllersPath);

            promiseArray.push(
              access(routesPath)
                .then(() => {
                  const routes = require(routesPath);
                  const controllers = require(controllersPath);

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
                  }
                })
            );
          }

          if (wonderSpecs.models.hasOwnProperty(routeName)) {
            const modelPath = path.join(
              chunksPath,
              `model-${wonderSpecs.models[routeName]}.js`
            );

            promiseArray.push(
              access(modelPath)
                .then(() => {
                  const model = require(modelPath);

                  wonder.models.push(model);
                })
            );
          }

          if (wonderSpecs.services.hasOwnProperty(routeName)) {
            const servicesPath = path.join(
              chunksPath,
              `services-${wonderSpecs.services[routeName]}.js`
            );

            promiseArray.push(
              access(servicesPath)
                .then(() => {
                  wonder.services[_.camelCase(file)] = require(servicesPath);
                })
            );
          }

          Promise.all(promiseArray).then(resolve);
        }))
      );
    }, console.log)
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

      wonder.http = http.createServer(app);

      wonder.http.listen(PORT, err => {
        if (err) console.log('error', err);
      });

      require(path.join(
        configPath,
        'functions',
        'jacketzip.js'
      ))().then(() => console.log('Jacketzip done!'));
    })
    .catch(e => console.log(e));
};

console.log(bootstrapPath);

readFile(path.join(chunksPath, 'wonderSpecs.json'))
  .then(data => {
    wonderSpecs = JSON.parse(data);
    return access(configPath, fs.F_OK);
  })
  .then(() => Promise.all([
    access(specialEnvironmentPath).then(() => {
      const specialConfig = require(specialEnvironmentPath);

      if (wonder.config) {
        wonder.config = _.defaults(specialConfig, wonder.config);
      } else {
        wonder.config = specialConfig;
      }
    }),
    access(commonEnvironmentPath).then(() => {
      const commonConfig = require(commonEnvironmentPath);

      if (wonder.config) {
        wonder.config = _.defaults(wonder.config, commonConfig);
      } else {
        wonder.config = commonConfig;
      }
    }),
    readdir(policiesPath).then(files => {
      wonder.policies = {};

      for (const file of files) {
        const filePath = path.join(policiesPath, file);

        wonder.policies[file.replace(/\.[^/.]+$/, "")] =
          require(filePath);
      }
    })
  ]))
    .then(() => access(bootstrapPath, fs.F_OK))
    .then(require(bootstrapPath))
    .then(main)
    .catch(main);