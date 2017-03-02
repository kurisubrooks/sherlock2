const config = require("../config.json");
const Logger = require("./Logger");
const EndpointManager = require("./EndpointManager");

class RequestHandler {
    constructor(app) {
        this.app = app;
        this.manager = new EndpointManager();
        this.app.use(this.handle);
    }

    handle(req, res) {
        console.log(req);
        const ip = req.ip.replace("::ffff:", "");
        const agent = req.headers["user-agent"];
        const method = req.method;
        const secure = req.secure;
        const params = req.params;
        const data = method === "POST" ? req.body : req.query;
        const log = `${ip} ${agent}`;

        if (!secure && !config.debug) return res.redirect(`https://${req.hostname}${req.url}`);
        if (!config.debug) res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

        res.set("Access-Control-Allow-Origin", "*");
        Logger.success("Handler", log);
        Logger.success("Handler", JSON.stringify(params));
        Logger.success("Handler", JSON.stringify(data));
        return this.manager.handle(req, res);
    }
}

module.exports = RequestHandler;
