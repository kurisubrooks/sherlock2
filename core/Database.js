const Sequelize = require("sequelize");
const crypto = require("crypto");
const path = require("path");

class Database {
    static get db() {
        return new Sequelize({
            logging: false,
            dialect: "sqlite",
            storage: path.join(__dirname, "..", "db.sqlite")
        });
    }

    static get models() {
        return {
            User: require("./Database/User")
            // Data: require("./Database/Data")
        };
    }

    static async newUser(data) {
        if (!data) return { ok: false, error: "Missing Data" };
        if (!data.author) return { ok: false, error: "Missing Author" };
        if (!data.application) return { ok: false, error: "Missing Application" };
        if (!data.permissions) data.permissions = {};
        if (!data.data) data.data = {};

        const token = Database.generateToken();

        await Database.models.User.create({
            token: token,
            author: data.author,
            application: data.application,
            permissions: JSON.stringify(data.permissions),
            data: JSON.stringify(data.data),
            disabled: false,
            admin: false
        });

        return { ok: true, author: data.author, token: token };
    }

    static async checkToken(token) {
        const user = await Database.models.User.findOne({ where: { token } });
        return user
            ? { ok: true, author: user.author }
            : { ok: false, error: "Unable to Authenticate Token", input: token };
    }

    static generateToken() {
        return crypto.randomBytes(Math.ceil(24 / 2)).toString("hex");
    }
}

module.exports = Database;
