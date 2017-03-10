const Endpoint = require("../../core/Endpoint");

class Panel extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel",
            method: "GET",
            token: false,
            admin: false,
            mask: false
        });
    }

    async run(req, res) {
        if (!req.session.token) return res.redirect("/panel/login");
        return res.render("panel/views/layout", {
            title: "Home",
            content: "home.ejs",
            data: {
                active: null,
                admin: req.session.admin
            }
        });
    }
}

module.exports = Panel;
