// Sherlock Core v2
// by @kurisubrooks

global.Promise = require('bluebird');
const server = require('express')();

const Logger = require('./core/Util/Logger');
const RequestHandler = require('./core/RequestHandler');

const http = require('http').createServer(server);
const request = new RequestHandler(server); // eslint-disable-line no-unused-vars

http.listen(9000, Logger.info('Core', 'Listening on Port 9000'));
