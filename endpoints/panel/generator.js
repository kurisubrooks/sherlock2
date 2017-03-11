const Endpoint = require("../../core/Endpoint");

class PanelGenerator extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/generator",
            method: "GET",
            token: false,
            admin: true,
            mask: false
        });
    }

    async run(req, res) {
        if (!req.session || !req.session.token) return res.redirect("/panel/login");
        return res.render("panel/views/layout", {
            title: "Generator",
            content: "generator.ejs",
            data: {
                admin: req.session.admin,
                active: "generator"
            }
        });
    }
}

module.exports = PanelGenerator;
