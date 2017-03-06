const fs = require("fs");
const path = require("path");

const Util = require("./Util/Util");
const Logger = require("./Util/Logger");
const Collection = require("./Util/Collection");

class EndpointHandler {
    constructor(app) {
        this.app = app;
        this.endpoints = new Collection();
        this.routes = new Collection();
    }

    loadModules(dir) {
        const endpoints = fs.readdirSync(path.join(__dirname, "..", dir));

        for (const item of endpoints) {
            const location = path.join(__dirname, "..", dir, item, "main.js");
            if (!fs.existsSync(location)) continue;

            const Endpoint = require(location);
            const instance = new Endpoint(this.app);

            if (instance.disabled) continue;
            if (this.endpoints.has(instance.name)) throw new Error("Endpoints cannot have the same name");

            Logger.info("Loaded", Util.toUpper(instance.name));
            this.endpoints.set(instance.name, instance);
            this.routes.set(instance.route, instance);
        }
    }
}

module.exports = EndpointHandler;
