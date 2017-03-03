// Sherlock Core v2
// by @kurisubrooks

global.Promise = require("bluebird");
const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyparser = require("body-parser");
const app = express();

const Logger = require("./core/Util/Logger");
const RequestHandler = require("./core/RequestHandler");

const key = fs.readFileSync(path.join(__dirname, "secure", "api.kurisubrooks.com.key"), "utf8");
const cert = fs.readFileSync(path.join(__dirname, "secure", "api.kurisubrooks.com.crt"), "utf8");
const options = { key, cert };

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

const http = require("http").createServer(app);
const https = require("https").createServer(options, app);
const request = new RequestHandler(express, app); // eslint-disable-line no-unused-vars

http.listen(80, Logger.info("Core", "Listening on Port 80"));
https.listen(443, Logger.info("Core", "Listening on Port 443"));
