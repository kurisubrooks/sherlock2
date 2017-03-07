const Endpoint = require("../../core/Endpoint");

class Status extends Endpoint {
    constructor() {
        super({
            name: "Status",
            description: "Returns the Status of Sherlock",
            route: "/api/status",
            method: "all",
            token: true,
            admin: true
        });
    }

    async run(req, res) {
        return res.send({
            ok: true,
            node: process.version.replace("v", ""),
            memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`
        });
    }
}

module.exports = Status;
