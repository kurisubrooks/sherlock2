const Endpoint = require("../../core/Endpoint");

class GeoRFS extends Endpoint {
    constructor() {
        super({
            name: "GeoRFS",
            description: "Check for fires in/near Greater Western Sydney",
            route: "/api/fires",
            token: false,
            retriever: {
                enable: true,
                interval: 1,
                format: "json",
                url: "http://www.rfs.nsw.gov.au/feeds/majorIncidents.json"
            }
        });
    }

    async test(data) {
        return data;
    }

    async run(req, res, data) {
        return data;
    }
}

module.exports = GeoRFS;
