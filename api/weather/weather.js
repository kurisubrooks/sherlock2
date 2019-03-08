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
                    interval: 10,
                    url: `https://api.darksky.net/forecast/${keys.darksky}/-33.7507,150.6939?units=si`
                },
                {
                    name: "bowenfels",
                    format: "json",
                    interval: 10,
                    url: `https://api.darksky.net/forecast/${keys.darksky}/-33.483,150.117?units=si`
                },
                {
                    name: "marayong",
                    format: "json",
                    interval: 10,
                    url: `https://api.darksky.net/forecast/${keys.darksky}/-33.7461,150.9001?units=si`
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
            data.location = "marayong";
        }

        const store = fs.readFileSync(path.join(__dirname, "..", "..", "storage", `${data.location}.json`));
        const weather = JSON.parse(store).data;

        const { currently, daily, timezone } = weather;

        const icon = this.icon(currently.icon, moment.unix(currently.time).format("HHMM"));

        const result = {
            ok: true,
            updated: moment.unix(currently.time).toDate(),
            location: {
                timezone,
                time_now: moment().tz(timezone).toDate()
            },
            weather: {
                icon,
                image: `https://api.kurisubrooks.com/static/weather/icons_v2/${icon}.png`,
                condition: currently.summary,
                temperature: Math.round(currently.temperature),
                feels_like: Math.round(currently.apparentTemperature),
                dewpoint: currently.dewPoint,
                humidity: currently.humidity * 100,
                pressure: `${currently.pressure} mBar`,
                visibility: `${currently.visibility} km`,
                wind: {
                    direction: this.degreesToDirection(currently.windBearing),
                    gust: `${currently.windGust} km/h`,
                    kph: `${currently.windSpeed} km/h`
                }
            },
            forecast: []
        };

        for (const day of daily.data) {
            result.forecast.push({
                date: {
                    time: day.time,
                    timezone,

                    day: Number(moment.unix(day.time).format("D")),
                    month: Number(moment.unix(day.time).format("M")),
                    year: Number(moment.unix(day.time).format("YYYY")),
                    total: Number(moment.unix(day.time).format("DDD")),
                    display: {
                        day: moment.unix(day.time).format("dddd"),
                        day_short: moment.unix(day.time).format("ddd"),
                        month: moment.unix(day.time).format("MMMM"),
                        month_short: moment.unix(day.time).format("MMM")
                    }
                },
                icon: this.icon(day.icon),
                image: `https://api.kurisubrooks.com/static/weather/icons_v2/${this.icon(day.icon)}.png`,
                condition: day.summary,
                high: Math.round(day.temperatureHigh),
                low: Math.round(day.temperatureLow),
                humidity: day.humidity * 100,
                rain_chance: day.precipProbability * 100,
                wind: {
                    direction: this.degreesToDirection(day.windBearing),
                    gust: `${day.windGust} km/h`,
                    kph: `${day.windSpeed} km/h`
                }
            });
        }

        return res.send(result);
    }

    pad(num) {
        return String(num).length === 1 ? `0${String(num)}` : String(num);
    }

    icon(condition) {
        const icons = {
            "clear-day": "day",
            "clear-night": "night",
            "rain": "rain",
            "snow": "snow",
            "sleet": "snow",
            "wind": "wind",
            "fog": "particles",
            "cloudy": "cloudy",
            "partly-cloudy-day": "day_mostlycloudy",
            "partly-cloudy-night": "night_mostlycloudy",
            "hail": "snow",
            "thunderstorm": "storm",
            "tornado": "wind",
            "unknown": "unknown"
        };

        return condition && condition !== "" && icons[condition]
            ? icons[condition]
            : icons.unknown;
    }

    /* eslint-disable complexity,yoda */
    degreesToDirection(bearing) {
        bearing %= 360;

        if (11.25 <= bearing && bearing < 33.75) {
            return "NNE";
        } else if (33.75 <= bearing && bearing < 56.25) {
            return "NE";
        } else if (56.25 <= bearing && bearing < 78.75) {
            return "ENE";
        } else if (78.75 <= bearing && bearing < 101.25) {
            return "E";
        } else if (101.25 <= bearing && bearing < 123.75) {
            return "ESE";
        } else if (123.75 <= bearing && bearing < 146.25) {
            return "SE";
        } else if (146.25 <= bearing && bearing < 168.75) {
            return "SSE";
        } else if (168.75 <= bearing && bearing < 191.25) {
            return "S";
        } else if (191.25 <= bearing && bearing < 213.75) {
            return "SSW";
        } else if (213.75 <= bearing && bearing < 236.25) {
            return "SW";
        } else if (236.25 <= bearing && bearing < 258.75) {
            return "WSW";
        } else if (258.75 <= bearing && bearing < 281.25) {
            return "W";
        } else if (281.25 <= bearing && bearing < 303.75) {
            return "WNW";
        } else if (303.75 <= bearing && bearing < 326.25) {
            return "NW";
        } else if (326.25 <= bearing && bearing < 348.75) {
            return "NNW";
        }

        return "N";
    }

    verify() {
        return 1;
    }
}

module.exports = Weather;
