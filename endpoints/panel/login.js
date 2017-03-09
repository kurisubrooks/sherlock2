const Endpoint = require("../../core/Endpoint");

class PanelLogin extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/login",
            method: "GET"
        });
    }

    async run(req, res, data) {
        return res.render("panel/views/login", { error: data.error });
    }
}

module.exports = PanelLogin;
