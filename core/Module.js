const config = require("../config");
const keychain = require("../keychain.json");
const Logger = require("./Logger");
const { error, toUpper } = require("./Util");

class Module {
    constructor(client, data = {}) {
        this.config = config;
        this.keychain = keychain;

        this.name = data.name;
        this.description = data.description;
        this.disabled = data.disabled || false;

        if (!this.name) throw new Error("Command Name is required");
        if (!this.description) throw new Error("Command Description is required");
        if (typeof this.name !== "string") throw new TypeError("Command name must be a string");
        if (typeof this.description !== "string") throw new TypeError("Command description must be a string");
        if (typeof this.disabled !== "boolean") throw new TypeError("Command disabled property must be a boolean");
    }

    run() {
        throw new Error("Missing Run Method");
    }

    log(message, style, stacktrace) {
        return Logger[style](toUpper(this.name), message, stacktrace);
    }

    error(message, channel) {
        return error(this.name, message, channel);
    }
}

module.exports = Module;
