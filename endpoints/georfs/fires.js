const Endpoint = require("../../core/Endpoint");
const markdown = require("to-markdown");
const turf = require("@turf/turf");
const path = require("path");
const fs = require("fs");

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

    run(req, res, data) {
        const store = fs.readFileSync(path.join(__dirname, "..", "..", "storage", `${this.name}.json`));
        const incidents = JSON.parse(store).data;
        const radius = 0.025;
        const results = [];
        let filter;

        if (!data.filter) filter = require("./filters/penrith.json");
        if (data.filter === "debug") filter = require("./filters/debug.json");

        for (const feature of filter.features) {
            try {
                const geometry = feature.geometry;
                const filter = geometry.type === "Point"
                    ? turf.circle(geometry, geometry.properties.radius)
                    : geometry;

                // Each incident
                for (const feature of incidents.features) {
                    const geometry = feature.geometry;

                    // Filter Results for Overlapping Regions
                    const result = turf.intersect(filter, geometry.type === "Point"
                        ? turf.circle(geometry, radius)
                        : geometry.geometries[1].geometries[0]);

                    // Match
                    if (result !== undefined) {
                        const formatted = this.format(feature);
                        if (formatted) results.push(formatted); // eslint-disable-line max-depth
                    }
                }
            } catch(error) {
                res.status(500).send({ ok: false, error: "Internal Server Error" });
                return this.error(error);
            }
        }

        // Sort results by HIGH→LOW warning levels
        // then sort by Distance from Home
        results.sort((a, b) => {
            const location = ["-33.746", "150.7123"];

            // if a's level is higher than b's, prepend
            if (a.level > b.level) {
                return -1;
            }

            // if a's warning level matches b's
            if (a.level === b.level) {
                const ag = a.geojson.geometry;
                const bg = b.geojson.geometry;

                const a_lat = ag.type === "Point"
                    ? ag.coordinates[1]
                    : ag.geometries[0].coordinates[1];

                const a_long = ag.type === "Point"
                    ? ag.coordinates[0]
                    : ag.geometries[0].coordinates[0];

                const b_lat = bg.type === "Point"
                    ? bg.coordinates[1]
                    : bg.geometries[0].coordinates[1];

                const b_long = bg.type === "Point"
                    ? bg.coordinates[0]
                    : bg.geometries[0].coordinates[0];

                const a_comp = [a_lat - location[0], a_long - location[1]];
                const b_comp = [b_lat - location[0], b_long - location[1]];

                // Sort by Distance
                return Math.hypot(a_comp[0], a_comp[1]) - Math.hypot(b_comp[0], b_comp[1]);
            }

            // Append
            return 1;
        });

        // Serve Data
        return res.send({
            ok: true,
            total: incidents.features.length,
            search: results.length,
            fires: results
        });
    }

    format(feature) {
        const properties = feature.properties;
        const description = markdown(properties.description).split("\n");
        const formatted = { };

        // Split Original String into Parsable Object
        for (const item of description) {
            description[item] = item.split(/:(.+)?/);
            description[item].splice(2, 1);
            description[item][1] = description[item][1].trim();
            formatted[description[item][0]] = description[item][1];
        }

        // if Level "Not Applicable" && Matches Blacklist, Remove
        if (alertLevels.indexOf(properties.category) === 0 && removeEvents.includes(formatted.TYPE)) return false;

        // Format Data
        return {
            title: properties.title.trim(),
            guid: Number(properties.guid.replace("https://incidents.rfs.nsw.gov.au/api/v1/incidents/", "")),
            level: alertLevels.indexOf(properties.category),
            type: formatted.TYPE,
            category: properties.category,
            location: formatted.LOCATION,
            status: formatted.STATUS,
            size: Number(formatted.SIZE.replace(" ha", "")),
            updated: {
                unix: Date.parse(formatted.UPDATED),
                timestamp: Date.parse(formatted.UPDATED)
            },
            geojson: {
                type: feature.type,
                geometry: feature.geometry,
                properties: { }
            }
        };
    }
}

module.exports = GeoRFS;
