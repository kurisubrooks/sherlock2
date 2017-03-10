const Endpoint = require("../../core/Endpoint");

class PanelManageUsers extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/users/manage",
            method: "GET",
            token: false,
            // admin: true,
            mask: false
        });
    }

    async run(req, res) {
        if (!req.session || !req.session.token) return res.redirect("/panel/login");
        return res.render("panel/views/layout", {
            title: "Manage Users",
            content: "users_manage.ejs",
            data: {
                admin: req.session.admin,
                active: "users_manage"
            }
        });
    }
}

module.exports = PanelManageUsers;
