const config = require("../config.json");
const Logger = require("./Util/Logger");
const EndpointHandler = require("./EndpointHandler");

class RequestHandler {
    constructor(express, app) {
        this.app = app;
        this.express = express;
        this.router = this.express.Router(); // eslint-disable-line new-cap
        this.app.use(this.handle.bind(this));
        this.handler = new EndpointHandler(app);
        this.handler.loadModules("endpoints");
    }

    handle(req, res) {
        if (!req.secure && !config.debug) return res.redirect(`https://${req.hostname}${req.url}`);
        if (!config.debug) res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

        const ip = req.ip.replace("::ffff:", "");
        const route = this.route(req.url);
        const data = req.method === "POST" ? req.body : req.query;
        const log = `${ip} /${route.path}/${route.endpoint} ${JSON.stringify(data)}`;

        res.set("Access-Control-Allow-Origin", "*");
        Logger.success("Router", log);
        return this.handler.runModule(route.endpoint, req, res, data);
    }

    route(url) {
        const input = url.split("/").splice(1, 2);
        const path = input[0];
        const endpoint = input[1].split("?")[0];
        return { path, endpoint };
    }
}

module.exports = RequestHandler;
