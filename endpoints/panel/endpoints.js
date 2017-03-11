const Endpoint = require("../../core/Endpoint");

class PanelManageEndpoints extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/endpoints",
            method: "GET",
            token: false,
            admin: true,
            mask: false
        });
    }

    async run(req, res) {
        if (!req.session || !req.session.token) return res.redirect("/panel/login");
        return res.render("panel/views/layout", {
            title: "Manage Endpoints",
            content: "endpoints_manage.ejs",
            data: {
                admin: req.session.admin,
                active: "endpoints_manage"
            }
        });
    }
}

module.exports = PanelManageEndpoints;
