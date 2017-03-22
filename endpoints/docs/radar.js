const Endpoint = require("../../core/Endpoint");

class RadarDocs extends Endpoint {
    constructor() {
        super({
            name: "Docs",
            description: "Documentation",
            route: "/panel/docs/radar",
            method: "GET",
            token: false,
            admin: true,
            mask: false
        });
    }

    async run(req, res) {
        if (!req.session || !req.session.token) return res.redirect("/panel/login");
        return res.render("panel/views/layout", {
            title: "Radar",
            content: "../../docs/views/radar.ejs",
            data: {
                admin: req.session.admin,
                active: "docs_radar"
            }
        });
    }
}

module.exports = RadarDocs;
