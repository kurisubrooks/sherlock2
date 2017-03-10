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

    static async validateRegKey(key) {
        return await Database.Models.RegKeys.findOne({ where: { key } })
            ? { ok: true }
            : { ok: false, error: "Invalid Registration Key" };
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

    static async checkLogin(username, password) {
        if (!username) return { ok: false, error: "Missing Username" };
        if (!password) return { ok: false, error: "Missing Password" };

        // Check if username exists
        username = username.toLowerCase();
        const user = await Database.Models.User.findOne({ where: { username } });
        if (!user) return { ok: false, error: "Incorrect Credentials" };

        // Compare passwords
        const auth = await bcrypt.compare(password, user.password);

        // Dafauq is this for?
        // if (auth && !user.admin) return { ok: false, error: "Administrators Only" };

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
        if (!Database.validateRegKey(data.auth).ok) return { ok: false, error: "Invalid Auth Key" };

        console.log("Auth Key is OK");

        // Check if user already exists
        const check1 = await Database.Models.User.findOne({ where: { username: data.username } });
        if (check1) return { ok: false, error: "Username already exists" };

        console.log("User doesn't already exist, OK");

        // Check if email is valid
        if (!/(.+)@(.+){2,}\.(.+){2,}/.test(data.email)) return { ok: false, error: "Invalid Email" };

        console.log("Email is VALID");

        // Check if username is valid
        if (!/^[a-zA-Z0-9]+$/.test(data.username)) return { ok: false, error: "Invalid Username" };

        console.log("Username is VALID");

        // Check if token already exists
        const token = Database.generateToken();
        const check2 = await Database.Models.User.findOne({ where: { token } });
        if (check2) return { ok: false, error: "Internal Server Error" };

        console.log("Generated token is OK");

        // Hash password
        const hash = bcrypt.hashSync(data.password, 10);

        console.log("Hashed Password");

        // Add user to db
        await Database.Models.User.create({
            admin: data.admin || false,
            token: token,
            email: data.email,
            username: data.username,
            password: hash,
            permissions: JSON.stringify({}),
            disabled: false
        });

        console.log("Created user");

        (await Database.Models.RegKeys.findOne({ where: { key: data.auth } })).destroy();

        console.log("Deleted Auth Key");

        // Return Data
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
