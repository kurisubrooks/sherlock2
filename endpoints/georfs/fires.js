const Endpoint = require("../../core/Endpoint");

const alertLevels = [
    "Not Applicable",
    "Advice",
    "Watch and Act",
    "Emergency Warning"
];

const alertType = [ // eslint-disable-line no-unused-vars
    "Out of control",
    "Being controlled",
    "Under control"
];

const fireType = [ // eslint-disable-line no-unused-vars
    "Bush Fire",
    "Grass Fire",
    "Hazard Reduction",
    "Structure Fire",
    "Burn off"
];

const removeEvents = [
    "MVA/Transport",
    "Assist Other Agency",
    "Search/Rescue",
    "Flood/Storm/Tree Down",
    "Vehicle/Equipment Fire",
    "Fire Alarm",
    "Medical",
    "HAZMAT",
    "Other"
];

class GeoRFS extends Endpoint {
    constructor() {
        super({
            name: "GeoRFS",
            description: "Check for fires in/near Greater Western Sydney",
            route: "/api/fires",
            method: "all",
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
