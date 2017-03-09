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
            mask: true
        });
    }

    async run(req, res, data) {
        if (!data.username) return res.redirect(`/panel/login?error=3`);
        if (!data.password) return res.redirect(`/panel/login?error=3`);

        const login = await Database.checkLogin(data.username, data.password);

        if (login.ok) {
            req.session.token = login.token;
            req.session.admin = login.admin;
            this.log(`${data.username} logged in successfully`, "debug");
            return res.redirect("/panel/system");
        }

        this.log(`Rejected login attempt for ${data.username}`, "debug");
        return res.redirect(`/panel/login?error=1`);
    }
}

module.exports = LoginHandler;
