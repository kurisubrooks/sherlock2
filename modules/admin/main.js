const Module = require("../../core/Module.js");

class AdminModule extends Module {
    constructor() {
        super({
            name: "admin",
            description: "idfk"
        });
    }

    async run(req, res, data) {
        return data;
    }
}

module.exports = AdminModule;
