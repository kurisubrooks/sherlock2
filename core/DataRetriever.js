const fs = require("fs");
const path = require("path");
const request = require("request-promise");
const Logger = require("./Util/Logger");

class DataRetriever {
    constructor(instance) {
        this.instance = instance;
        this.storage = path.join(__dirname, "..", "storage");

        if (!fs.existsSync(this.storage)) fs.mkdirSync(this.storage);
    }

    start() {
        if (Array.isArray(this.instance.retriever)) {
            for (var index = 0; index < this.instance.retriever.length; index++) {
                const data = this.instance.retriever[index];

                if (data.enable && data.enable === false) continue;
                if (!data.name || !data.interval || !data.format || !data.url) {
                    Logger.error("Missing Name, Interval, Format or URL Parameters");
                    continue;
                }

                this.handle(data);
                setInterval(() => this.handle(data), data.interval * 60 * 1000);
            }
        } else {
            const data = this.instance.retriever;

            if (data.enable && data.enable === false) return false;
            if (!data.name) throw new Error("Data Retriever must have a save file name");
            if (!data.interval) throw new Error("Data Retriever must have a set interval (in minutes)!");
            if (!data.format) throw new Error("Data Retriever must have a format");
            if (!data.url) throw new Error("Data Retriever must have a url");

            this.handle(data);
            setInterval(() => this.handle(data), data.interval * 60 * 1000);
        }

        return false;
    }

    async handle(options) {
        let response = await request({
            headers: { "User-Agent": "Mozilla/5.0" },
            uri: options.url,
            json: options.format === "json"
        }).catch(error => this.error(error));

        if (!response) return false;

        response = typeof response === "string" ? JSON.parse(response) : response;

        if (this.instance.verify) {
            const result = this.instance.verify(response);

            if (result === 0) {
                Logger.error("Data Retriever", `Data returned from ${this.instance.name} failed quality checking.`);
                return false;
            }
        }

        if (options.format === "json") {
            return fs.writeFileSync(path.join(this.storage, `${options.name}.json`), JSON.stringify({ ok: true, data: response }));
        }

        return fs.writeFileSync(path.join(this.storage, `${options.name}.${options.format}`), response);
    }

    error(message) {
        Logger.error("Data Retriever", message, true);
        return false;
    }
}

module.exports = DataRetriever;
