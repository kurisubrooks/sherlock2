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

    loadModules(directory) {
        const folders = fs.readdirSync(path.join(__dirname, "..", directory));

        for (const folder of folders) {
            const location = path.join(__dirname, "..", directory, folder);
            if (!fs.statSync(location).isDirectory()) continue;
            const files = fs.readdirSync(location);

            for (const file of files) {
                if (path.extname(file) !== ".js") continue;

                const Endpoint = require(path.join(__dirname, "..", directory, folder, file));
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
