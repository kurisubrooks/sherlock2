const Endpoint = require("../../core/Endpoint");
const path = require("path");

class Panel extends Endpoint {
    constructor() {
        super({
            name: "panel",
            description: "admin panel",
            route: "/panel"
        });
    }

    async run(req, res) {
        return res.sendFile(path.join(__dirname, "pages", "login.html"));
    }
}

module.exports = Panel;
