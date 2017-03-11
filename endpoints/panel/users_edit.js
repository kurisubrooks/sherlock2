const Endpoint = require("../../core/Endpoint");

class PanelEditUser extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/users/edit",
            method: "GET",
            token: false,
            admin: true,
            mask: false
        });
    }

    async run(req, res) {
        if (!req.session || !req.session.token) return res.redirect("/panel/login");
        return res.render("panel/views/layout", {
            title: "Edit User",
            content: "users_edit.ejs",
            data: {
                admin: req.session.admin,
                active: "users_edit"
            }
        });
    }
}

module.exports = PanelEditUser;
