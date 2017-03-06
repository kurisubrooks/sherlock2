const Endpoint = require("../../core/Endpoint");
const path = require("path");

class PanelLogin extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/login"
        });
    }

    async run(req, res) {
        return res.sendFile(path.join(__dirname, "pages", "login.html"));
    }
}

module.exports = PanelLogin;
