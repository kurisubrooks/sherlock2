const Endpoint = require("../../core/Endpoint");
const Database = require("../../core/Database");

class RegistrationHandler extends Endpoint {
    constructor() {
        super({
            name: "Registration",
            description: "Handles User Registration",
            route: "/api/register",
            method: "POST",
            token: false,
            mask: true
        });
    }

    async run(req, res, data) {
        if (!data.email) return res.send({ ok: false, error: "Missing Email" });
        if (!data.username) return res.send({ ok: false, error: "Missing Username" });
        if (!data.password) return res.send({ ok: false, error: "Missing Password" });
        if (!data.auth) return res.send({ ok: false, error: "Auth Key Required" });

        // Validate Registration Key
        if (!Database.validateRegKey(data.auth)) return res.send({ ok: false, error: "Invalid Auth Key" });

        // Handle User Generation
        const user = Database.newUser({
            auth: data.auth,
            email: data.email,
            username: data.username,
            password: data.password
        });

        const response = await user;

        if (!response.ok) return res.send(response);

        this.log(`User Created: ${response.username}`, "debug");

        return res.send(response);
    }
}

module.exports = RegistrationHandler;
