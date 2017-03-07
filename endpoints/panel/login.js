const Endpoint = require("../../core/Endpoint");
const path = require("path");

class PanelLogin extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/login",
            method: "GET"
        });
    }

    async run(req, res) {
        return res.render("panel/views/login");
    }
}

module.exports = PanelLogin;
