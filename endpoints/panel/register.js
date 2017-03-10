const Endpoint = require("../../core/Endpoint");

class PanelRegister extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/register",
            method: "GET"
        });
    }

    async run(req, res) {
        if (req.session.token) return res.redirect("/panel/system");
        return res.render("panel/views/register");
    }
}

module.exports = PanelRegister;
