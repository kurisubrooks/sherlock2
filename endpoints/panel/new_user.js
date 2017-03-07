const Endpoint = require("../../core/Endpoint");

class PanelNewUser extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/new_user",
            method: "GET"
        });
    }

    async run(req, res) {
        return res.render("panel/views/layout", {
            title: "New User",
            active: "new_user",
            content: "partials/new_user.ejs"
        });
    }
}

module.exports = PanelNewUser;
