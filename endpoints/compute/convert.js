const Endpoint = require("../../core/Endpoint");
const units = require("./assets/units");

class UnitConverter extends Endpoint {
    constructor() {
        super({
            name: "Convert",
            description: "Converts Units between each other",
            route: "/api/compute/convert",
            method: "all",
            token: true,
            admin: false,
            mask: false
        });
    }

    async run(req, res, data) {
        const store = [];
        let fromFound = false, toFound = false,
            fromUnit, toUnit;

        if (!data.query) {
            return res.status(400).send({ ok: false, error: "Missing 'query' field" });
        }

        for (const item of Object.keys(units)) {
            units[item].derived.push(units[item].SI);

            for (const unit of units[item].derived) {
                if (!unit.match || !Array.isArray(unit.match)) {
                    res.status(500).send({ ok: false, error: "Internal Server Error" });
                    return this.error(`Unit '${unit.name}' doesn't have a valid match array`);
                }

                store.push(...unit.match);
            }

            const match = new RegExp(/((?:\+|-)?\d*\.?\d+)\s?(.+) (?:to|as|in) (.+)/, "g");
            const exec = match.exec(data.query);

            if (exec) {
                const [input, amount, from, to] = exec;
                const number = Number(amount);
                const unit = item;

                fromUnit = from;
                toUnit = to;

                if (isNaN(number)) {
                    return res.status(400).send({ ok: false, error: "Query doesn't resolve to a valid number" });
                }

                if (!units[item].derived.find(unit => unit.match.includes(from))) continue;
                fromFound = true;

                if (!units[item].derived.find(unit => unit.match.includes(to))) continue;
                toFound = true;

                const objects = {
                    unit: units[item],
                    from: units[item].derived.find(unit => unit.match.indexOf(from) > -1),
                    to: units[item].derived.find(unit => unit.match.indexOf(to) > -1)
                };

                let output = objects.to.fromSI(objects.from.toSI(number));

                if (objects.from.name === objects.unit.SI.name) {
                    output = objects.to.fromSI(number);
                } else if (objects.to.name === objects.unit.SI.name) {
                    output = objects.from.toSI(number);
                }

                const disOutput = output > 0.01 ? output.toFixed(2) : output;
                const frUnit = number === 1 ? objects.from.display[0] : objects.from.display[1];
                const tUnit = disOutput === 1 ? objects.to.display[0] : objects.to.display[1];

                return res.send({
                    ok: true,
                    type: unit,
                    query: input,
                    input: {
                        value: Number(number),
                        unit: objects.from.name,
                        display: `${number} ${frUnit}`
                    },
                    output: {
                        value: Number(disOutput),
                        unit: objects.to.name,
                        display: `${disOutput} ${tUnit}`
                    }
                });
            }
        }

        if (!fromFound || !toFound) {
            return res.status(400).send({ ok: false, error: `${fromUnit || toUnit} isn't a valid/supported unit` });
        }

        return res.status(400).send({ ok: false, error: "Unable to parse query" });
    }
}

module.exports = UnitConverter;
