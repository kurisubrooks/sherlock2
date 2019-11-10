const Endpoint = require('../../core/Endpoint');
const markdown = require('to-markdown');
const turf = require('@turf/turf');
const path = require('path');
const fs = require('fs');

const alertLevels = [
  'Not Applicable',
  'Advice',
  'Watch and Act',
  'Emergency Warning'
];

const alertType = [ // eslint-disable-line no-unused-vars
  'Out of control',
  'Being controlled',
  'Under control'
];

const fireType = [ // eslint-disable-line no-unused-vars
  'Bush Fire',
  'Grass Fire',
  'Hazard Reduction',
  'Structure Fire',
  'Burn off'
];

const removeEvents = [
  'MVA/Transport',
  'Assist Other Agency',
  'Search/Rescue',
  'Flood/Storm/Tree Down',
  'Vehicle/Equipment Fire',
  'Fire Alarm',
  'Medical',
  'HAZMAT',
  'Other'
];

const locations = {
  'local': {
    filter: require('./filters/local.json'),
    center: ['-33.74', '150.89']
  },
  'emergency': {
    filter: require('./filters/emergency.json'),
    center: ['-35.417', '149.072']
  },
  'all': {
    filter: require('./filters/all.json'),
    center: ['-33.87', '151.2']
  }
};

class GeoRFS extends Endpoint {
  constructor() {
    super({
      name: 'GeoRFS',
      description: 'Check for fires in/near Greater Western Sydney',
      route: '/api/fire',
      method: 'all',
      token: false,
      admin: false,
      mask: false,
      retriever: {
        name: 'rfs',
        format: 'json',
        interval: 2,
        url: 'https://www.rfs.nsw.gov.au/feeds/majorIncidents.json'
      }
    });
  }

  run(req, res, data) {
    const store = fs.readFileSync(path.join(__dirname, '..', '..', 'storage', `${this.retriever.name}.json`));
    const incidents = JSON.parse(store).data;
    const radius = 0.025;
    const results = [];
    let missing = 0;
    let filters;

    if (data.raw || data.raw !== undefined) {
      return res.send(JSON.parse(store));
    }

    if (!data.filter || data.filter === 'local') {
      filters = locations.local;
    } else if (data.filter === 'emergency') {
      filters = locations.emergency;
    } else {
      filters = locations.all;
    }

    for (const feature of filters.filter.features) {
      try {
        const geometry = feature.geometry;
        const filter = geometry.type === 'Point'
          ? turf.circle(geometry, geometry.properties.radius)
          : geometry;

        // Each incident
        for (const feature of incidents.features) {
          const geometry = feature.geometry;

          // Filter Results for Overlapping Regions
          try {
            const result = turf.intersect(filter, geometry.type === 'Point'
              ? turf.circle(geometry, radius)
              : geometry.geometries[1].geometries[0]);

            // Match
            if (result !== undefined) {
              const formatted = this.format(feature);
              if (formatted) results.push(formatted); // eslint-disable-line max-depth
            }
          } catch(error) {
            console.log(error.message);
            ++missing;
            continue;
          }
        }
      } catch(error) {
        res.status(500).send({ ok: false, error: 'Internal Server Error' });
        return this.error(error);
      }
    }

    // Sort results by HIGH→LOW warning levels
    // then sort by Distance from Home
    results.sort((a, b) => {
      const center = filters.center;

      // if a's level is higher than b's, prepend
      if (a.level > b.level) {
        return -1;
      }

      // if a's warning level matches b's
      if (a.level === b.level) {
        const a_geo = a.geojson.geometry;
        const b_geo = b.geojson.geometry;

        const a_lat = a_geo.type === 'Point'
          ? a_geo.coordinates[1]
          : a_geo.geometries[0].coordinates[1];

        const a_long = a_geo.type === 'Point'
          ? a_geo.coordinates[0]
          : a_geo.geometries[0].coordinates[0];

        const b_lat = b_geo.type === 'Point'
          ? b_geo.coordinates[1]
          : b_geo.geometries[0].coordinates[1];

        const b_long = b_geo.type === 'Point'
          ? b_geo.coordinates[0]
          : b_geo.geometries[0].coordinates[0];

        const a_comp = [a_lat - center[0], a_long - center[1]];
        const b_comp = [b_lat - center[0], b_long - center[1]];

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
      errored: missing,
      fires: results
    });
  }

  format(feature) {
    const properties = feature.properties;
    const description = markdown(properties.description).split('\n');
    const formatted = { };

    // Split Original String into Parsable Object
    for (const item of description) {
      description[item] = item.split(/:(.+)?/);
      description[item].splice(2, 1);
      description[item][1] = description[item][1].trim();
      formatted[description[item][0]] = description[item][1];
    }

    // if Level "Not Applicable" && Matches Blacklist, Remove
    if (alertLevels.indexOf(properties.category) === 0 && removeEvents.includes(formatted.TYPE)) {
      return false;
    }

    // Format Data
    return {
      title: properties.title.trim(),
      guid: Number(properties.guid.replace('https://incidents.rfs.nsw.gov.au/api/v1/incidents/', '')),
      level: alertLevels.indexOf(properties.category),
      type: formatted.TYPE,
      category: properties.category,
      location: formatted.LOCATION,
      status: formatted.STATUS,
      updated: new Date(Date.parse(formatted.UPDATED)),
      size: Number(formatted.SIZE.replace(' ha', '')),
      geojson: {
        type: feature.type,
        geometry: feature.geometry,
        properties: {}
      }
    };
  }
}

module.exports = GeoRFS;
