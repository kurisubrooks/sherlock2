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
        return res.render("panel/views/layout", {
            title: "Panel",
            active: "system",
            content: "main"
        });
    }
}

module.exports = Panel;
