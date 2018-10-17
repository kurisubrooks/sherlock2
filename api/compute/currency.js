const Endpoint = require("../../core/Endpoint");
const keys = require("../../keychain.json");
const fx = require("./assets/money");
const fs = require("fs");
const path = require("path");

class CurrencyConverter extends Endpoint {
    constructor() {
        super({
            name: "Currency",
            description: "Converts Currencies between each other",
            route: "/api/compute/currency",
            method: "all",
            token: true,
            admin: false,
            mask: false,
            retriever: {
                name: "currency",
                format: "json",
                interval: 4 * 60, // every 4 hours
                url: `http://data.fixer.io/api/latest?access_key=${keys.fixer}`
            }
        });
    }

    async run(req, res, data) {
        if (!data.query) {
            return res.status(400).send({ ok: false, error: "Missing 'query' field" });
        }

        const pattern = /((?:\+|-)?\d*\.?\d+)\s?(.+) to (.+)/;
        const match = new RegExp(pattern, "g");
        const exec = match.exec(data.query);
        const [original, amount, from, to] = exec;

        if (!exec) {
            return res.status(500).send({ ok: false, error: "Unable to parse query" });
        }

        const store = fs.readFileSync(path.join(__dirname, "..", "..", "storage", `${this.retriever.name}.json`));
        const exchange = JSON.parse(store).data;

        const toCurrency = to.toUpperCase();
        const fromCurrency = from.toUpperCase();

        exchange.rates[exchange.base] = 1;

        if (!exchange.rates[toCurrency] || !exchange.rates[fromCurrency]) {
            return res.status(400).send({ ok: false, error: `Unknown Currency: ${toCurrency || fromCurrency}` });
        }

        fx.rates = exchange.rates;

        const result = fx(amount).from(fromCurrency).to(toCurrency).toFixed(2);

        return res.send({
            ok: true,
            type: "currency",
            query: original,
            input: {
                value: Number(amount),
                currency: fromCurrency,
                display: `${amount} ${fromCurrency}`
            },
            output: {
                value: Number(result),
                currency: toCurrency,
                display: `${result} ${toCurrency}`
            }
        });
    }
}

module.exports = CurrencyConverter;
