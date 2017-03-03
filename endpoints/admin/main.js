const Endpoint = require("../../core/Endpoint");

class AdminEndpoint extends Endpoint {
    constructor() {
        super({
            name: "admin",
            description: "administrative thing",
            route: "/api/"
        });
    }

    async run(req, res, data) {
        return res.send({
            ok: true,
            node: process.version.replace("v", ""),
            memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
            data
        });
    }
}

module.exports = AdminEndpoint;
