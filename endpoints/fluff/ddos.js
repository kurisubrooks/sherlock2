const Endpoint = require("../../core/Endpoint");

class DDOS extends Endpoint {
    constructor() {
        super({
            name: "ddos",
            description: "shits and giggles",
            route: "/ddos"
        });
    }

    async run(req, res) {
        return res.send({ ok: true, ip: req.ip.replace("::ffff:", ""), response: "DDOSing..." });
    }
}

module.exports = DDOS;
