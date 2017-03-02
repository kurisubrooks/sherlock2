const config = require("../config.json");
const Logger = require("./Logger");
const EndpointManager = require("./EndpointManager");

class RequestHandler {
    constructor(app) {
        this.app = app;
        this.app.use(this.handle.bind(this));
        this.manager = new EndpointManager();
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
        return this.manager.handle(route.endpoint, req, res, data);
    }

    route(url) {
        const input = url.split("/").splice(1, 2);
        const path = input[0];
        const endpoint = input[1].split("?")[0];
        return { path, endpoint };
    }
}

module.exports = RequestHandler;
