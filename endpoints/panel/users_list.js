const Endpoint = require("../../core/Endpoint");

class PanelListUsers extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/users/all",
            method: "GET"
        });
    }

    async run(req, res) {
        return res.render("panel/views/layout", {
            title: "List Users",
            active: "users_list",
            content: "users_list.ejs",
            data: { }
        });
    }
}

module.exports = PanelListUsers;
