const Endpoint = require("../../core/Endpoint");
const Database = require("../../core/Database");

class LoginHandler extends Endpoint {
    constructor() {
        super({
            name: "Login",
            description: "Handles User Logins",
            route: "/api/login",
            method: "POST",
            token: false,
            admin: false,
            mask: true
        });
    }

    async run(req, res, data) {
        if (!data.username) return res.send({ ok: false, error: "Missing Required Fields" });
        if (!data.password) return res.send({ ok: false, error: "Missing Required Fields" });

        return Database.checkLogin(data.username, data.password).then(login => {
            if (login.ok) {
                req.session.token = login.token;
                req.session.admin = login.admin;
                this.log(`${data.username} logged in successfully`, "debug");
                return res.send({ ok: true });
            }

            this.log(`Rejected login attempt for ${data.username}`, "debug");
            return res.send({ ok: false, error: "Invalid Credentials" });
        });
    }
}

module.exports = LoginHandler;
