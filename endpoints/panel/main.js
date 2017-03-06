const Endpoint = require("../../core/Endpoint");

class Panel extends Endpoint {
    constructor() {
        super({
            name: "panel",
            description: "admin panel",
            route: "/panel"
        });
    }

    async run(req, res, data) {
        return res.send({ ok: true });
    }
}

module.exports = Panel;
