const Endpoint = require("../../core/Endpoint");

class PanelRegister extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/register",
            method: "GET",
            token: false,
            admin: false,
            mask: true
        });
    }

    async run(req, res) {
        if (req.session.token) return res.redirect("/panel");
        return res.render("panel/views/register");
    }
}

module.exports = PanelRegister;
