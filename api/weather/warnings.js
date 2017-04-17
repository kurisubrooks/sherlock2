const Endpoint = require("../../core/Endpoint");
const cheerio = require("cheerio");
const moment = require("moment");
const path = require("path");
const fs = require("fs");

class Warnings extends Endpoint {
    constructor() {
        super({
            name: "Warnings",
            description: "Check Weather Warnings for Western Sydney",
            route: "/api/warnings",
            method: "all",
            disabled: true,
            token: false,
            admin: false,
            mask: false,
            retriever: {
                enable: true,
                interval: 5,
                format: "html",
                url: `http://www.bom.gov.au/products/IDN65156.shtml`
            }
        });
    }

    run(req, res) {
        const file = fs.readFileSync(path.join(__dirname, "..", "..", "storage", `${this.name}.json`));
        const store = JSON.parse(file);

        const $ = cheerio.load(store);
    }
}

module.exports = Warnings;
