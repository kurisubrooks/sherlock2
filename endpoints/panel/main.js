const Endpoint = require("../../core/Endpoint");

class Panel extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel",
            method: "GET"
        });
    }

    async run(req, res) {
        return !req.session.token ? res.redirect("/panel/login") : res.redirect("/panel/system");
    }
}

module.exports = Panel;
