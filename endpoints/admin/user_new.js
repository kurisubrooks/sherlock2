const Endpoint = require("../../core/Endpoint");
const Database = require("../../core/Database");

class NewUserHandler extends Endpoint {
    constructor() {
        super({
            name: "New User",
            description: "Handles User Logins",
            route: "/api/users/new",
            method: "POST",
            token: false,
            mask: true
        });
    }

    async run(req, res, data) {
        if (!req.session || !req.session.token) return { ok: false, error: "Authentication Required" };
        if (!req.session.admin) return { ok: false, error: "Forbidden" };
        if (!data.type) return { ok: false, error: "Missing Type" };
        if (!data.username) return { ok: false, error: "Missing Username" };

        if (data.type === "admin") {
            data.type = 1;
        } else {
            data.type = 0;
        }

        const user = Database.newUser({
            type: Number(data.type),
            username: data.username,
            password: data.password || null,
            admin: Boolean(data.type)
        });

        this.log(`Username: ${data.username}, Admin: ${data.admin || false}`);

        return user;
    }
}

module.exports = NewUserHandler;
