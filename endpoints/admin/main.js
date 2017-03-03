const Endpoint = require("../../core/Endpoint");

class AdminModule extends Endpoint {
    constructor() {
        super({
            name: "admin",
            description: "idfk"
        });
    }

    async run(req, res, data) {
        return res.send({ ok: true, data });
    }
}

module.exports = AdminModule;
