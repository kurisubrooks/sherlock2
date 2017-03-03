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
            User: require("./Database/User"),
            Data: require("./Database/Data")
        };
    }

    static async newUser(data) {
        if (!data) return { ok: false, error: "Missing Data" };
        if (!data.username) return { ok: false, error: "Missing Username" };
        if (!data.application) return { ok: false, error: "Missing Application" };
        if (!data.permissions) data.permissions = {};
        if (!data.data) data.data = {};

        const token = Database.generateToken();

        await Database.models.User.create({
            token: token,
            username: data.username,
            application: data.application,
            permissions: JSON.stringify(data.permissions),
            data: JSON.stringify(data.data),
            disabled: false
        });

        return { ok: true, username: data.username, token: token };
    }

    static async checkToken(token) {
        const user = await Database.models.User.findOne({ where: { token } });
        return user
            ? { ok: true, username: user.username }
            : { ok: false, error: "Unable to find Token in Database" };
    }

    static generateToken() {
        return crypto.randomBytes(Math.ceil(24 / 2)).toString("hex");
    }
}

module.exports = Database;
