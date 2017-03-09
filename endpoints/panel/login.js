const Endpoint = require("../../core/Endpoint");

class PanelLogin extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/login",
            method: "GET"
        });
    }

    async run(req, res, data) {
        const errors = {
            "1": "Incorrect Credentials",
            "2": "Internal Server Error",
            "3": "Missing Data",
            "4": "You need to login first!"
        };

        const error = errors[data.error] || null;

        return res.render("panel/views/login", { error });
    }
}

module.exports = PanelLogin;
