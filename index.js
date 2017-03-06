// Sherlock Core v2
// by @kurisubrooks

global.Promise = require("bluebird");
const server = require("express")();
const path = require("path");
const fs = require("fs");

const Logger = require("./core/Util/Logger");
const RequestHandler = require("./core/RequestHandler");

const key = fs.readFileSync(path.join(__dirname, "secure", "api.kurisubrooks.com.key"), "utf8");
const cert = fs.readFileSync(path.join(__dirname, "secure", "api.kurisubrooks.com.crt"), "utf8");
const options = { key, cert };

const http = require("http").createServer(server);
const https = require("https").createServer(options, server);
const request = new RequestHandler(server); // eslint-disable-line no-unused-vars

http.listen(80, Logger.info("Core", "Listening on Port 80"));
https.listen(443, Logger.info("Core", "Listening on Port 443"));
