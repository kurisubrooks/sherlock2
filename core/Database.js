const Sequelize = require("sequelize");
const valid = require("validator");
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
        return {
            User: require("./Database/User"),
            RegKeys: require("./Database/RegistrationKeys")
        };
    }

    static newRegKey() {
        const key = crypto.randomBytes(Math.ceil(12 / 2)).toString("hex");
        Database.Models.RegKeys.create({ key });
        return { ok: true, key };
    }

    static validateRegKey(key) {
        return Database.Models.RegKeys.findOne({ where: { key } }).then(data => {
            if (!data) return { ok: false, error: "Invalid Auth Key" };
            return { ok: true };
        });
    }

    static async checkToken(token) {
        if (!token) return { ok: false, error: "Missing Token" };
        const user = await Database.Models.User.findOne({ where: { token } });
        return user
            ? { ok: true, username: user.username, token }
            : { ok: false, error: "Unable to Authenticate Token", input: token };
    }

    static async checkAdmin(token) {
        if (!token) return { ok: false, error: "Missing Token" };
        const user = (await Database.Models.User.findOne({ where: { token } })).admin;
        return user
            ? { ok: true, username: user.username, token }
            : { ok: false, error: "User is not an Administrator" };
    }

    static async changeAdmin(username, admin) {
        if (!username) return { ok: false, error: "Missing Username" };
        if (!admin) return { ok: false, error: "Missing Admin" };
        const user = await Database.Models.User.findOne({ where: { username } });
        const perm = Boolean(admin);
        if (!user) return { ok: false, error: "Invalid Username" };
        const req = await user.update({ admin: perm });
        return req
            ? { ok: true }
            : { ok: false };
    }

    static async checkLogin(username, password) {
        if (!username) return { ok: false, error: "Missing Username" };
        if (!password) return { ok: false, error: "Missing Password" };

        // Check if username exists
        const user = await Database.Models.User.findOne({ where: { username } });
        if (!user) return { ok: false, error: "Incorrect Credentials" };

        // Compare passwords
        const auth = await bcrypt.compare(password, user.password);

        // Return Results
        return auth
            ? { ok: true, token: user.token, admin: user.admin }
            : { ok: false, error: "Incorrect Credentials" };
    }

    static async newUser(data) {
        if (!data) return { ok: false, error: "Missing Data" };
        if (!data.auth) return { ok: false, error: "Missing Auth Key" };
        if (!data.email) return { ok: false, error: "Missing Email" };
        if (!data.username) return { ok: false, error: "Missing Username" };
        if (!data.password) return { ok: false, error: "Missing Password" };

        // Check auth key
        const keyCheck = await Database.Models.RegKeys.findOne({ where: { key: data.auth } });
        if (!keyCheck) return { ok: false, error: "Invalid Auth Key" };

        console.log("OK: Auth Key");

        // Check if user already exists
        const nameCheck = await Database.Models.User.findOne({ where: { username: data.username } });
        if (nameCheck) return { ok: false, error: "Username already exists" };

        console.log("OK: Username isn't taken");

        // Check if email is valid
        if (!valid.isEmail(data.email)) return { ok: false, error: "Invalid Email" };

        console.log("OK: Email is VALID");

        // Check if username is valid
        if (!/^[a-zA-Z0-9]+$/.test(data.username)) return { ok: false, error: "Invalid Username" };

        console.log("OK: Username is VALID");

        // Check if token already exists
        const token = Database.generateToken();
        const tokenCheck = await Database.Models.User.findOne({ where: { token } });
        if (tokenCheck) return { ok: false, error: "Internal Server Error" };

        console.log("OK: Generated token isn't taken");

        // Hash password
        const hash = bcrypt.hashSync(data.password, 10);

        console.log("OK: Password Hashed");

        // Delete Key from DB
        const keyRemove = await Database.Models.RegKeys.findOne({ where: { key: data.auth } });
        if (!keyRemove) return { ok: false, error: "Internal Server Error" };
        await keyRemove.destroy();

        console.log("OK: Auth Key Deleted");

        // Add user to db
        const user = await Database.Models.User.create({
            admin: data.admin || false,
            token: token,
            email: data.email,
            username: data.username,
            password: hash,
            permissions: JSON.stringify({}),
            disabled: false
        });

        if (!user) return { ok: false, error: "Internal Server Error" };

        console.log("OK: User Created");

        return { ok: true, username: data.username, token };
    }

    static async deleteUser(token) {
        if (!token) return { ok: false, error: "Missing Token" };

        // Get user from db
        const user = await Database.Models.User.findOne({ where: { token } });

        // Error if token doesn't belong to a user
        if (!user) return { ok: false, error: "User does not exist" };

        // RIP OUT THEIR SPLEEN and serve it to them on a plate
        await user.destroy();
        return { ok: true, username: user.username };
    }

    static generateToken() {
        return crypto.randomBytes(Math.ceil(32 / 2)).toString("hex");
    }
}

module.exports = Database;
