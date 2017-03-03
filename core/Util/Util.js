const crypto = require("crypto");
const Logger = require("./Logger");

class Util {
    constuctor() {
        throw new Error(`${this.constructor.name} class cannot be instantiated`);
    }

    static error(res, error) {
        Logger.error("Unknown", error);
        return res.send({ ok: false, error: error });
    }

    static toUpper(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static createToken(count) {
        return crypto.randomBytes(Math.ceil(count / 2)).toString("hex").slice(0, count);
    }
}

module.exports = Util;
