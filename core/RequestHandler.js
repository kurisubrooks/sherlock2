const Database = require("./Database");
const Logger = require("./Util/Logger");
const config = require("../config.json");
const EndpointManager = require("./EndpointManager");

class RequestHandler {
    constructor(express, app) {
        this.app = app;
        this.express = express;
        this.router = this.express.Router(); // eslint-disable-line new-cap
        this.app.use(this.router);
        this.handler = new EndpointManager(this.app);
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

    async handle(req, res) {
        if (!req.secure && !config.debug) return res.redirect(`https://${req.hostname}${req.url}`);
        if (req.secure) res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

        const ip = req.ip.replace("::ffff:", "");
        const url = req.url.split("?")[0];
        const token = req.headers.authorization;
        const body = req.method === "GET" ? req.query : req.body;
        const data = Object.keys(body).length > 0 ? body : null;
        const route = this.routes.get(req.route.path);
        const user = token ? await Database.checkToken(token) : { ok: false };

        if (!route) {
            res.status(404).send({ ok: false, error: "Missing/Unknown Endpoint" });
            return this.log(false, ip, url, data, user, "MISSING_ENDPOINT");
        }

        if (route.token && !token) {
            res.status(401).send({ ok: false, error: "Authentication Required" });
            return this.log(false, ip, url, data, user, "NO_TOKEN");
        }

        if (route.token && !user.ok) {
            res.status(401).send({ ok: false, error: user.error });
            return this.log(false, ip, url, data, user, "BAD_TOKEN");
        }

        this.log(true, ip, url, data, user);
        res.set("Access-Control-Allow-Origin", "*");
        return route.run(req, res, data);
    }

    log(ok, ip, url, data, auth, error) {
        const style = ok ? "success" : "error";
        const indicator = ok ? "✓" : "✘";
        const user = auth && auth.ok ? auth.username : ip;
        return Logger[style]("Router", `${user} ${indicator} ${url}${data ? ` ${JSON.stringify(data)}` : ""}${error ? ` - ${error}` : ""}`);
    }
}

module.exports = RequestHandler;
