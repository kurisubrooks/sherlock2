const fs = require("fs");
const path = require("path");

const Util = require("./Util");
const Logger = require("./Logger");
const Collection = require("./Collection");

class ModuleLoader {
    contructor(app) {
        this.app = app;
        this.modules = new Map();
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
        return module.run(req, res, data);
    }

    matchModule(mentioned, args) {
        return args;
        /*
        const commandName = mentioned && args.length > 0
            ? args.splice(0, 2)[1].toLowerCase()
            : args.splice(0, 1)[0].slice(config.sign.length).toLowerCase();
        const command = this.modules.get(commandName) || this.aliases.get(commandName);
        return { command, commandName };
        */
    }
}

module.exports = ModuleLoader;
