const fs = require("fs");
const path = require("path");
const request = require("request-promise");

const Logger = require("./Util/Logger");

class DataRetriever {
    constructor(instance) {
        this.instance = instance;
    }

    start() {
        if (!this.instance.retriever.enable) return false;
        if (!this.instance.retriever.interval) throw new Error("Data Retriever must have a set interval (in minutes)!");
        if (!this.instance.retriever.format) throw new Error("Data Retriever must have a format");
        if (!this.instance.retriever.url) throw new Error("Data Retriever must have a url");

        this.handle(this.instance.retriever);
        return setInterval(() => this.handle(this.instance.retriever), this.instance.retriever.interval * 60 * 1000);
    }

    async handle(options) {
        const response = await request({
            headers: { "User-Agent": "Mozilla/5.0" },
            uri: options.url,
            json: options.format === "json"
        }).catch(error => {
            return this.error(error);
        });

        return fs.writeFileSync(path.join(__dirname, "..", "storage", `${this.instance.name}.json`), JSON.stringify({ ok: true, data: response }));
    }

    error(message) {
        return Logger.error("Data Retriever", message, true);
    }
}

module.exports = DataRetriever;
