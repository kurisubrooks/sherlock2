const Endpoint = require("../../core/Endpoint");

class PanelDelUser extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/users/delete",
            method: "GET"
        });
    }

    async run(req, res) {
        if (!req.session || !req.session.token) return res.redirect("/panel/login?error=4");
        return res.render("panel/views/layout", {
            title: "Delete User",
            active: "users_del",
            content: "users_del.ejs",
            data: { }
        });
    }
}

module.exports = PanelDelUser;
