const Endpoint = require("../../core/Endpoint");
const request = require("request-promise");
const langs = require("./languages.json");

class Translate extends Endpoint {
    constructor() {
        super({
            name: "Translate",
            description: "Translates Text to/from a language",
            route: "/api/translate",
            token: true
        });
    }

    async run(req, res, data) {
        if (!data.query) {
            return res.status(400).send({ ok: false, error: "Missing 'query' field" });
        }

        if (!data.to) {
            return res.status(400).send({ ok: false, error: "Missing 'to' lang field" });
        }

        if (!this.validate(data.to)) {
            return res.status(400).send({ ok: false, error: "Unknown 'to' Language" });
        }

        if (data.from && data.from !== "") {
            if (!this.validate(data.from)) {
                return res.status(400).send({ ok: false, error: "Unknown 'from' Language" });
            }
        }

        let response;
        const to_lang = this.validate(data.to).code;
        const from_lang = data.from ? this.validate(data.from).code : "auto";
        const query = this.slicer(data.query);

        try {
            const resp = await request({
                headers: { "User-Agent": "Mozilla/5.0" },
                uri: "http://translate.googleapis.com/translate_a/single",
                qs: {
                    client: "gtx",
                    dt: "t",
                    sl: from_lang,
                    tl: to_lang,
                    q: query // eslint-disable-line id-length
                }
            });

            response = JSON.parse(resp.replace(/,+/g, ","));
        } catch(error) {
            res.status(500).send({ ok: false, error: "Internal Server Error" });
            return this.error(error);
        }

        return res.send({
            ok: true,
            to: this.validate(data.to || "en"),
            from: this.validate(response[1]),
            query: data.query,
            result: response[0][0][0]
        });
    }

    validate(query) {
        if (!query) return null;

        for (const obj of langs) {
            const input = query.toLowerCase();
            const item = Object.values(obj).map(val => val.toLowerCase());
            if (!item.includes(input)) continue;
            return obj;
        }

        return null;
    }

    slicer(query) {
        const values = {
            "。": ". ",
            "、": ", ",
            "？": "? ",
            "！": "! ",
            "「": "\"",
            "」": "\" ",
            "\u3000": " "
        };

        return query
            .replace(/\r?\n|\r/g, " ")
            .replace(new RegExp(Object.keys(values).join("|"), "ig"), match => values[match]);
    }
}

module.exports = Translate;
