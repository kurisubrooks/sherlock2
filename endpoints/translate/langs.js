const Endpoint = require("../../core/Endpoint");
const langs = require("./languages.json");

class TranslateLangs extends Endpoint {
    constructor() {
        super({
            name: "Translate",
            description: "Lists Supported Translation Langs",
            route: "/api/translate/langs",
            token: false,
            admin: false,
            mask: false
        });
    }

    async run(req, res) {
        return res.send({
            ok: true,
            langs
        });
    }
}

module.exports = TranslateLangs;
