const fs = require("fs");
const path = require("path");

const Util = require("./Util/Util");
const Logger = require("./Util/Logger");
const Collection = require("./Util/Collection");

class EndpointManager {
    constructor(app) {
        this.app = app;
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
                if (this.routes.has(instance.route)) throw new Error("Endpoints cannot have the same route");

                Logger.info("Loaded", Util.toUpper(instance.route));
                this.routes.set(instance.route, instance);
            }
        }
    }
}

module.exports = EndpointManager;
