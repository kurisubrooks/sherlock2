const fs = require("fs");
const path = require("path");

const Util = require("./Util/Util");
const Logger = require("./Util/Logger");
const Collection = require("./Util/Collection");

class ModuleLoader {
    constructor(app) {
        this.app = app;
        this.modules = new Collection();
    }

    loadModules(dir) {
        const modules = fs.readdirSync(path.join(__dirname, "..", dir));

        for (const item of modules) {
            const location = path.join(__dirname, "..", dir, item, "main.js");
            if (!fs.existsSync(location)) continue;

            const Module = require(location);
            const instance = new Module(this.app);

            if (instance.disabled) continue;
            if (this.modules.has(instance.name)) throw new Error("Modules cannot have the same name");

            Logger.info("Loaded Module", Util.toUpper(instance.name));
            this.modules.set(instance.name, instance);
        }
    }

    runModule(endpoint, req, res, data) {
        const module = this.modules.get(endpoint);
        if (!module) return res.status(404).send({ ok: false, error: "Missing Endpoint" });
        return module.run(req, res, data);
    }
}

module.exports = ModuleLoader;
