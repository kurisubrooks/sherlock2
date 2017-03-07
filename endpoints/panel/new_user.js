const Endpoint = require("../../core/Endpoint");
const path = require("path");

class PanelNewUser extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel/new_user"
        });
    }

    async run(req, res) {
        return res.sendFile(path.join(__dirname, "pages", "new_user.html"));
    }
}

module.exports = PanelNewUser;
