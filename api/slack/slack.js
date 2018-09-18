const Endpoint = require("../../core/Endpoint");

class SlackHook extends Endpoint {
    constructor() {
        super({
            name: "Slack Webhook",
            description: "Handles Slack Webhooks",
            route: "/api/slack",
            token: false,
            admin: false,
            mask: true
        });
    }

    async run(req, res, data) {
        data.command = data.command.slice(1);

        if (data.command === "translate") {
            const Command = require("../translate/translate.js");
            const translate = new Command();

            const payload = {
                to: "ja",
                query: data.text,
                referral: true
            };

            const response = await translate.run(req, res, payload);

            return res.send({
                attachments: [{
                    author_name: "Google Translate",
                    author_icon: "https://upload.wikimedia.org/wikipedia/commons/d/db/Google_Translate_Icon.png",
                    fields: [
                        {
                            title: "Query",
                            value: response.query,
                            short: false
                        },
                        {
                            title: "Response",
                            value: response.result,
                            short: false
                        }
                    ]
                }]
            });
        }

        return false;
    }
}

module.exports = SlackHook;
