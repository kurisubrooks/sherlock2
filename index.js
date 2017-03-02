// Sherlock Core v2
// by @kurisubrooks

global.Promise = require("bluebird");
// const fs = require("fs");
// const path = require("path");
const express = require("express");
const app = express();

const Logger = require("./core/Logger");
const ModuleLoader = require("./core/ModuleLoader");
const RequestHandler = require("./core/RequestHandler");

// const key = fs.readFileSync(path.join(__dirname, "secure", "api.kurisubrooks.com.key"), "utf8");
// const cert = fs.readFileSync(path.join(__dirname, "secure", "api.kurisubrooks.com.crt"), "utf8");
// const options = { key, cert };

const http = require("http").createServer(app);
// const https = require("https").createServer(options, app);

const loader = new ModuleLoader(app).loadModules("./modules/"); // eslint-disable-line no-unused-vars
const request = new RequestHandler(app); // eslint-disable-line no-unused-vars

http.listen(80, Logger.info("Core", "Server Started on Port 80"));
// https.listen(443, Logger.info("Core", "Server Started on Port 443"));
