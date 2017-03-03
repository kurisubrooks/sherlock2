const Endpoint = require("../../core/Endpoint");

class AdminEndpoint extends Endpoint {
    constructor() {
        super({
            name: "admin",
            description: "idfk",
            route: "/api/"
        });
    }

    async run(req, res, data) {
        return res.send({ ok: true, data });
    }
}

module.exports = AdminEndpoint;
