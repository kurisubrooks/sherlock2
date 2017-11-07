const Endpoint = require("../../core/Endpoint");
const keys = require("../../keychain.json");
const moment = require("moment-timezone");
const path = require("path");
const fs = require("fs");

class Weather extends Endpoint {
    constructor() {
        super({
            name: "Weather",
            description: "Grab the Weather",
            route: "/api/weather",
            method: "all",
            token: false,
            admin: false,
            mask: false,
            retriever: [
                {
                    name: "penrith",
                    format: "json",
                    interval: 5,
                    url: `https://api.wunderground.com/api/${keys.wunderground.penrith}/conditions/forecast10day/astronomy/q/AU/Penrith.json`
                },
                {
                    name: "bowenfels",
                    format: "json",
                    interval: 5,
                    url: `https://api.wunderground.com/api/${keys.wunderground.lithgow}/conditions/forecast10day/astronomy/q/AU/Bowenfels.json`
                },
                {
                    name: "greenway",
                    format: "json",
                    interval: 5,
                    url: `https://api.wunderground.com/api/${keys.wunderground.greenway}/conditions/forecast10day/astronomy/q/AU/Greenway.json`
                }
            ]
        });
    }

    run(req, res, data) {
        let locationFound = false;

        if (data.location) {
            for (var index = 0; index < this.retriever.length; index++) {
                if (this.retriever[index].name === data.location) {
                    locationFound = true;
                    break;
                }
            }

            if (!locationFound) {
                return res.status(400).send({ ok: false, error: "Unknown Location" });
            }
        } else {
            data.location = "penrith";
        }

        const store = fs.readFileSync(path.join(__dirname, "..", "..", "storage", `${data.location}.json`));
        const weather = JSON.parse(store).data;

        const { current_observation, forecast, sun_phase } = weather;

        const icon = this.icon(current_observation.icon, moment.unix(current_observation.local_epoch).format("HHMM"), sun_phase);

        const result = {
            ok: true,
            updated: new Date(current_observation.observation_time_rfc822),
            location: {
                display: `${current_observation.display_location.city}, ${current_observation.display_location.state} ${current_observation.display_location.state_name}`,
                city: current_observation.display_location.city,
                state: current_observation.display_location.state,
                country: current_observation.display_location.state_name,

                time_now: current_observation.local_time_rfc822,
                timezone: current_observation.local_tz_long
            },
            weather: {
                icon,
                image: `https://api.kurisubrooks.com/static/weather/icons_v2/${icon}.png`,
                condition: current_observation.weather,
                temperature: Math.round(current_observation.temp_c),
                feels_like: Math.round(current_observation.feelslike_c),
                dewpoint: Number(current_observation.dewpoint_c),
                humidity: current_observation.relative_humidity,
                pressure: `${current_observation.pressure_mb} mBar`,
                visibility: `${current_observation.visibility_km} km`,
                wind: {
                    chill: current_observation.windchill_c,
                    direction: current_observation.wind_dir,
                    degrees: Number(current_observation.wind_degrees),
                    gust: `${current_observation.wind_gust_kph} km/h`,
                    kph: `${current_observation.wind_kph} km/h`
                },
                precipitation: {
                    hour: `${current_observation.precip_1hr_metric} mm`,
                    today: `${current_observation.precip_today_metric} mm`
                }
            },
            forecast: []
        };

        for (const day of forecast.simpleforecast.forecastday) {
            result.forecast.push({
                date: {
                    time: day.date.epoch,
                    timezone: day.date.tz_long,

                    day: day.date.day,
                    month: day.date.month,
                    year: day.date.year,
                    total: day.date.yday,
                    display: {
                        day: day.date.weekday,
                        day_short: day.date.weekday_short,
                        month: day.date.monthname,
                        month_short: day.date.monthname_short
                    }
                },
                icon: this.icon(day.icon),
                image: `https://api.kurisubrooks.com/static/weather/icons_v2/${this.icon(day.icon)}.png`,
                condition: day.conditions,
                high: Math.round(Number(day.high.celsius)),
                low: Math.round(Number(day.low.celsius)),
                humidity: `${day.avehumidity}%`,
                rain_chance: `${day.pop}%`,
                rainfall: `${day.qpf_allday.mm} mm`,
                snowfall: `${day.snow_allday.cm} cm`,
                wind: {
                    max: `${day.maxwind.kph} km/h`,
                    average: `${day.avewind.kph} km/h`,
                    direction: day.avewind.dir,
                    degrees: Number(day.avewind.degrees)
                }
            });
        }

        return res.send(result);
    }

    pad(num) {
        return String(num).length === 1 ? `0${String(num)}` : String(num);
    }

    icon(condition, now, phases) {
        let sunrise, sunset, day;

        if (now && phases) {
            sunrise = `${this.pad(phases.sunrise.hour)}${this.pad(phases.sunrise.minute)}`;
            sunset = `${this.pad(phases.sunset.hour)}${this.pad(phases.sunset.minute)}`;
            day = now >= sunrise && now <= sunset;
        } else {
            day = true;
        }

        if (condition.indexOf("nt_") > -1) {
            condition = condition.replace("nt_");
            day = false;
        }

        const icons = {
            "chanceflurries": "snow",
            "chancerain": "rain",
            "chancesleat": "snow",
            "chancesnow": "snow",
            "chancetstorms": "storm",
            "clear": day ? "day" : "night",
            "cloudy": "cloudy",
            "flurries": "snow",
            "fog": "particles",
            "hazy": "particles",
            "mostlycloudy": day ? "day_mostlycloudy" : "night_mostlycloudy",
            "mostlysunny": "day_mostlyclear",
            "partlycloudy": day ? "day_partlycloudy" : "night_partlycloudy",
            "partlysunny": "day_mostlycloudy",
            "rain": "rain",
            "sleat": "snow",
            "snow": "snow",
            "sunny": "day",
            "tstorms": "storm",
            "unknown": "unknown"
        };

        return condition && condition !== "" && icons[condition]
            ? icons[condition]
            : icons.unknown;
    }

    // 0 = bad
    // 1 = good
    verify(data) {
        const { response, current_observation, forecast, moon_phase, sun_phase } = data;

        // Ensure Data Exists
        if (!response || !current_observation || !forecast || !moon_phase || !sun_phase) {
            return 0;
        }

        // Ensure Source Responded with all data types
        for (let index = 0; index < response.features.length; index++) {
            if (response.features[index] === 0) {
                return 0;
            }
        }

        // Ensure Data is Verifiable

        if (current_observation.icon === "" || current_observation.icon === "unknown") {
            return 0;
        }

        if (current_observation.condition === "") {
            return 0;
        }

        return 1;
    }
}

module.exports = Weather;
