const Sequelize = require("sequelize");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const path = require("path");

const database = new Sequelize({
    logging: false,
    dialect: "sqlite",
    storage: path.join(__dirname, "..", "db.sqlite")
});

class Database {
    static get db() {
        return database;
    }

    static get Models() {
        return { User: require("./Database/User") };
    }

    static async checkToken(token) {
        if (!token) return { ok: false, error: "Missing Token" };
        const user = await Database.Models.User.findOne({ where: { token } });
        return user
            ? { ok: true, username: user.username, token }
            : { ok: false, error: "Unable to Authenticate Token", input: token };
    }

    static async checkLogin(username, password) {
        if (!username) return { ok: false, error: "Missing Username" };
        if (!password) return { ok: false, error: "Missing Password" };
        const user = await Database.Models.User.findOne({ where: { username } });
        if (!user) return { ok: false, error: "User does not exist" };
        return bcrypt.compareSync(password, user.hash)
            ? { ok: true, token: user.token }
            : { ok: false, error: "Incorrect Password" };
    }

    static async newUser(data) {
        if (!data) return { ok: false, error: "Missing Data" };
        if (!data.username) return { ok: false, error: "Missing Username" };
        const check = await Database.Models.User.findOne({ where: { username: data.username } });
        if (check) return { ok: false, error: "Username already exists" };
        const token = Database.generateToken();
        const hash = bcrypt.hashSync(data.password, 10);

        await Database.Models.User.create({
            token: token,
            username: data.username,
            password: hash,
            applications: JSON.stringify([]),
            permissions: JSON.stringify({}),
            data: JSON.stringify({}),
            disabled: false,
            admin: false
        });

        return { ok: true, username: data.username, token };
    }

    static async deleteUser(token) {
        if (!token) return { ok: false, error: "Missing Token" };
        const user = await Database.Models.User.findOne({ where: { token } });
        if (!user) return { ok: false, error: "User does not exist" };
        await user.destroy();
        return { ok: true, username: user.username };
    }

    static async newApplication(data) {
        if (!data) return { ok: false, error: "Missing Data" };
        if (!data.token) return { ok: false, error: "Missing Token" };
        if (!data.name) return { ok: false, error: "Missing Name" };
        if (!data.description) return { ok: false, error: "Missing Description" };
        if (!data.url) return { ok: false, error: "Missing URL" };
        const user = await Database.Models.User.findOne({ where: { token: data.token } });
        if (!user) return { ok: false, error: "User does not exist" };
        const applications = JSON.parse(user.applications);
        applications.push({ name: data.name, description: data.description, url: data.url });
        await user.update({ applications: JSON.stringify(applications) });
        return { ok: true };
    }

    static generateToken() {
        return crypto.randomBytes(Math.ceil(32 / 2)).toString("hex");
    }
}

module.exports = Database;
