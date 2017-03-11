const Endpoint = require("../../core/Endpoint");
const Database = require("../../core/Database");

class RegKeyGenerator extends Endpoint {
    constructor() {
        super({
            name: "RegKey Generator",
            description: "Handles RegKey Generation",
            route: "/api/regkey",
            method: "POST",
            token: false,
            admin: true
        });
    }

    async run(req, res) {
        if (!req.session || !req.session.token) return res.send({ ok: false, error: "Authentication Required" });
        if (!req.session.admin) return res.send({ ok: false, error: "Forbidden" });

        // Handle User Generation
        const key = Database.newRegKey();
        this.log("Generated New RegKey", "debug");
        return res.send(key);
    }
}

module.exports = RegKeyGenerator;
