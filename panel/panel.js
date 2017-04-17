const Endpoint = require("../core/Endpoint");

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
        return res.redirect("/panel/me");
    }
}

module.exports = Panel;
