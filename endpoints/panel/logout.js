const Endpoint = require("../../core/Endpoint");

class PanelLogout extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/logout",
            method: "GET",
            token: false,
            admin: false,
            mask: false
        });
    }

    async run(req, res) {
        delete req.session.token;
        return res.redirect("/panel/login");
    }
}

module.exports = PanelLogout;
