const Endpoint = require("../../core/Endpoint");

class LogoutHandler extends Endpoint {
    constructor() {
        super({
            name: "Logout",
            description: "Handles User Logouts",
            route: "/api/logout",
            method: "POST",
            token: false
        });
    }

    async run(req, res) {
        req.session.destroy();
        return res.redirect("/panel");
    }
}

module.exports = LogoutHandler;
