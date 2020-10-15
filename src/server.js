// server dependencies
import dotenv from 'dotenv';
import sirv from 'sirv';
import polka from 'polka';
import cookie from 'cookie';
import bodyParser from 'body-parser';
import compression from 'compression';
import * as sapper from '@sapper/server';

// database
import Knex from 'knex';

// filesystem
import path from 'path';
import fs from 'fs';

// utilities
import _ from 'lodash';
import getUser from "../utils/getUser";
import getRouteName from '../utils/getRouteName';

dotenv.config();

// my dear knexie
const knex = new Knex({
  client: process.env.DB_CLIENT || 'mysql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'main',
    charset: process.env.DB_CHARSET || 'utf8'
  }
});

// working with filesystem
const srcPath = path.join(process.cwd(), 'src');
const apiPath = path.join(srcPath, 'api');
const configPath = path.join(srcPath, 'config');

// environment
const { PORT, NODE_ENV, API_URL } = process.env;
const dev = NODE_ENV === 'development';

if (!API_URL) {
  API_URL = 'http://localhost:3000';
}

/**
 * Global variable containing server cache, plugins, models, functions
 * @returns JS object
 */
global.wonder = new Object();
wonder.knex = knex;

/**
 * Function to be a member of polka's res object
 */
function send (payload = new Object) {
  if (payload instanceof Object) {
    if (payload._statusCode) {
      this.statusCode = payload._statusCode;
      delete payload._statusCode;
    } else {
      this.statusCode = 200;
    }

    payload = JSON.stringify(payload);
  } else {
    this.statusCode = 200;

    payload = JSON.stringify({
      response: payload
    });
  }

  this.end(payload);
}

/**
 * Function to be a member of polka's res object
 */
function _throw (statusCode = 400) {
  this.statusCode = statusCode;
  this.end('{}');
}

/**
 * Main function of the server.
 */
const main = () => {
  // proceed if connected to database
  knex.raw('select 1 + 1 as testValue').then(() => {
    fs.readdir(apiPath, (err, files) => {
      if (err) {
        console.log('You have no API. I don\'t want to start the server.');
        return;
      };

      wonder.paths = new Object();
      wonder.services = new Object();
      wonder.cache = new Object();

      Promise.all(
        // Initialize server filesystem dependencies
        files.map(file => new Promise((resolve, reject) => {
          let currentPath = path.join(apiPath, file),
            servicesPath = path.join(currentPath, 'services.js'),
            routesPath = path.join(currentPath, 'routes.json'),
            controllersPath = path.join(currentPath, 'controllers.js'),
            routeName = getRouteName(file);

          Promise.all([
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

                    _.set(wonder.paths, [
                      routes[j].method,
                      `/${routeName}${routes[j].path}`,
                      'policies'
                    ], []);

                    if (routes[j].hasOwnProperty('config')) {
                      if (routes[j].config.hasOwnProperty('policies')) {
                        for (let policy of routes[j].config.policies) {
                            wonder
                              .paths
                              [routes[j].method]
                              [`/${routeName}${routes[j].path}`]
                              .policies
                              .push(wonder.policies[policy]);
                        }
                      }
                    }

                    _.set(
                      wonder.paths,
                      [
                        routes[j].method,
                        `/${routeName}${routes[j].path}`,
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
          ]).then(resolve);
        }))
      )
        .then(() => {
          polka()
            .use(bodyParser.json({ extended: true }))
            .use(async (req, res, next) => {
              const start = new Date();

              await next();

              const ms = Date.now() - start.getTime();

              console.log(
                `${start.toLocaleString()} | ${res.statusCode} ${req.method} on ` +
                req.url + ' took ' + ms + ' ms'
              );
            })
            .use(async (req, res, next) => {
              req.cookies = cookie.parse(req.headers.cookie || '');

              const questionMarkIndex = req.url.indexOf('?');

              if (questionMarkIndex === -1) {
                req.path = req.url;
                req.search = '';
              } else {
                req.path = req.url.substring(0, questionMarkIndex);
                req.search = req.url.substring(questionMarkIndex + 1);
              }

              if (req.path.substring(0, 4) === '/api') {
                res.throw = _throw;

                req.path = req.path.substring(4);

                if (req.path.charAt(req.path.length - 1) !== '/') {
                  req.path += '/';
                }

                if (
                  wonder.paths.hasOwnProperty(req.method) &&
                  wonder.paths[req.method].hasOwnProperty(req.path)
                ) {
                  try {
                    res.send = send;

                    responseHandling: {
                      for (let policy of wonder.paths[req.method][req.path].policies) {
                        await policy(req, res);

                        if (res.headersSent) {
                          break responseHandling;
                        }
                      };
  
                      await wonder.paths[req.method][req.path].handler(req, res);
                    }
                  } catch (e) {
                    console.log(e);

                    res.throw(500);
                  }
                } else {
                  res.throw(404)
                }

                return;
              } else {
                await next();
              }
            })
            .use(compression({ threshold: 0 }))
            .use(sirv('static', { dev }))
            .use(async (req, res, next) => {
              let user = await getUser(req.cookies.jwt);

              if (user) {
                user = Object.assign({
                  isAuthenticated: true
                }, _.pick(user, ['first_name', 'last_name', 'username', 'permissions']))
              } else {
                user = {
                  isAuthenticated: false
                }
              }

              sapper.middleware({
                session: () => {
                  return {
                    apiUrl: API_URL,
                    user
                  };
                }
              })(req, res, next);
            })
            .listen(PORT, err => {
              if (err) console.log('error', err);
            });
        }, e => {
          console.log(e);
        });
    });
  });
};

fs.access(configPath, fs.F_OK, err => {
  if (err) main();

  const bootstrapPath = path.join(configPath, 'functions', 'bootstrap.js');
  const policiesPath = path.join(configPath, 'functions', 'policies');
  const commonEnvironmentPath = path.join(configPath, 'environments', 'common.js');
  const specialEnvironmentPath = (
    dev ?
      path.join(configPath, 'environments', 'development.js') :
      path.join(configPath, 'environments', 'production.js')
  );

  Promise.all([
    new Promise((resolve, reject) => {
      fs.access(specialEnvironmentPath, fs.F_OK, err => {
        if (!err) {
          let specialConfig = require(specialEnvironmentPath);
      
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
          let commonConfig = require(commonEnvironmentPath);
      
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
        wonder.policies = new Object();

        if (!err) {
          for (let file of files) {
            const filePath = path.join(policiesPath, file);
  
            wonder.policies[file.replace(/\.[^/.]+$/, "")] = require(filePath);
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
