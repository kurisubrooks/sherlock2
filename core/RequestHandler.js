const config = require("../config.json");
const Logger = require("./Util/Logger");
const EndpointHandler = require("./EndpointHandler");

class RequestHandler {
    constructor(express, app) {
        this.app = app;
        this.express = express;
        this.router = this.express.Router(); // eslint-disable-line new-cap
        this.app.use(this.router);
        this.handler = new EndpointHandler(this.app);
        this.handler.loadModules("endpoints");
        this.routes = this.handler.routes;
        this.handleRoutes();
    }

    handleRoutes() {
        // Endpoints
        for (const item of this.routes.values()) {
            this.router.all(item.route, this.handle.bind(this));
        }

        // 404
        this.router.all("*", this.handle.bind(this));
    }

    handle(req, res) {
        if (!req.secure && !config.debug) return res.redirect(`https://${req.hostname}${req.url}`);
        if (req.secure) res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

        const ip = req.ip.replace("::ffff:", "");
        const url = req.url.split("?")[0];
        const endpoint = req.params.endpoint;
        const params = req.method === "POST" ? req.body : req.query;
        const data = Object.keys(params).length > 0 ? params : null;
        const log = `${ip} ${url} ${data ? JSON.stringify(data) : ""}`;

        if (!endpoint || !this.handler.endpoints.get(endpoint)) {
            res.status(404).send({ ok: false, error: "Missing Endpoint" });
            return Logger.error("Router", log);
        } else {
            Logger.success("Router", log);
        }

        res.set("Access-Control-Allow-Origin", "*");
        return this.handler.runModule(endpoint, req, res, data);
    }
}

module.exports = RequestHandler;
