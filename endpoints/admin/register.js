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
        if (!data.email) return { ok: false, error: "Missing Email" };
        if (!data.username) return { ok: false, error: "Missing Username" };
        if (!data.password) return { ok: false, error: "Missing Password" };
        if (!data.auth) return { ok: false, error: "Auth Key Required" };

        // Validate Registration Key
        if (!Database.validateRegKey(data.auth)) return { ok: false, error: "Invalid Auth Key" };

        // Handle User Generation
        const user = await Database.newUser({
            auth: data.auth,
            email: data.email,
            username: data.username,
            password: data.password
        });

        console.log(user);

        if (!user.ok) return { ok: false, error: user.error };

        this.log(`User Created: ${user.username}`, "debug");

        return user;
    }
}

module.exports = RegistrationHandler;
