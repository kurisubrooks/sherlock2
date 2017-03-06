const fs = require("fs");
const path = require("path");

const Util = require("./Util/Util");
const Logger = require("./Util/Logger");
const Collection = require("./Util/Collection");

class EndpointManager {
    constructor(app) {
        this.app = app;
        this.endpoints = new Collection();
        this.routes = new Collection();
    }

    loadModules(dir) {
        const folders = fs.readdirSync(path.join(__dirname, "..", dir));

        for (const items of folders) {
            const files = fs.readdirSync(path.join(__dirname, "..", dir, items));

            for (const file of files) {
                const item = path.join(__dirname, "..", dir, items, file);

                if (path.extname(file) !== ".js") continue;

                const Endpoint = require(item);
                const instance = new Endpoint(this.app);

                if (instance.disabled) continue;
                if (this.endpoints.has(instance.name)) throw new Error("Endpoints cannot have the same name");

                Logger.info("Loaded", Util.toUpper(instance.name));
                this.endpoints.set(instance.name, instance);
                this.routes.set(instance.route, instance);
            }
        }
    }
}

module.exports = EndpointManager;
