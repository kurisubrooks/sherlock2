const Endpoint = require("../../core/Endpoint");

class PanelNewUser extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/users/new",
            method: "GET"
        });
    }

    async run(req, res) {
        return res.render("panel/views/layout", {
            title: "New User",
            active: "users_new",
            content: "users_new.ejs",
            data: { }
        });
    }
}

module.exports = PanelNewUser;
