const Database = require("./Database");
const Logger = require("./Util/Logger");
const config = require("../config.json");
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

        // Root
        this.router.all("/", (req, res) => res.send("Hello"));

        // 404
        this.router.all("*", this.handle.bind(this));
    }

    async handle(req, res) {
        if (!req.secure && !config.debug) return res.redirect(`https://${req.hostname}${req.url}`);
        if (req.secure) res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

        const ip = req.ip.replace("::ffff:", "");
        const url = req.url.split("?")[0];
        const endpoint = req.params.endpoint;
        const auth = req.headers.authorization;
        const body = req.method === "GET" ? req.query : req.body;
        const data = Object.keys(body).length > 0 ? body : null;

        if (!endpoint || !this.handler.endpoints.get(endpoint)) {
            res.status(404).send({ ok: false, error: "Unknown Endpoint" });
            return this.log(false, ip, url, data, null, "Unknown Endpoint");
        }

        if (!auth) {
            res.status(401).send({ ok: false, error: "Authorization Required" });
            return this.log(false, ip, url, data, null, "Missing Token");
        }

        const user = await Database.checkToken(auth);

        if (!user.ok) {
            res.status(401).send(user);
            return this.log(false, ip, url, data, user, "Bad Token");
        }

        this.log(true, ip, url, data, user);
        res.set("Access-Control-Allow-Origin", "*");
        return this.handler.runModule(endpoint, req, res, data);
    }

    log(ok, ip, url, data, auth, error) {
        const style = ok ? "success" : "error";
        const indicator = ok ? "✓" : "✘";
        const user = auth && auth.ok ? auth.author : ip;
        return Logger[style]("Router", `${user} ${indicator} ${url}${data ? ` ${JSON.stringify(data)}` : ""}${error ? ` (Reason: ${error})` : ""}`);
    }
}

module.exports = RequestHandler;
