const Endpoint = require("../../core/Endpoint");
const path = require("path");

class Panel extends Endpoint {
    constructor() {
        super({
            name: "Panel",
            description: "Admin Panel",
            route: "/panel"
        });
    }

    async run(req, res) {
        return res.sendFile(path.join(__dirname, "pages", "main.html"));
    }
}

module.exports = Panel;