const config = require("../config.json");
const Logger = require("./Util/Logger");
const { error, toUpper } = require("./Util/Util");

class Endpoint {
    constructor(data = {}) {
        this.config = config;

        this.name = data.name;
        this.description = data.description;
        this.disabled = data.disabled || false;

        if (!this.name) throw new Error("Endpoint Name is required");
        if (!this.description) throw new Error("Endpoint Description is required");
        if (typeof this.name !== "string") throw new TypeError("Endpoint name must be a string");
        if (typeof this.description !== "string") throw new TypeError("Endpoint description must be a string");
        if (typeof this.disabled !== "boolean") throw new TypeError("Endpoint disabled property must be a boolean");
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

module.exports = Endpoint;
