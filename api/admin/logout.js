const Endpoint = require("../../core/Endpoint");

class LogoutHandler extends Endpoint {
    constructor() {
        super({
            name: "Logout",
            description: "Handles User Logouts",
            route: "/api/logout",
            method: "POST",
            token: false,
            admin: false,
            mask: false
        });
    }

    async run(req, res) {
        req.session.destroy();
        return res.send({ ok: true });
    }
}

module.exports = LogoutHandler;
