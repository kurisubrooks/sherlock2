const Endpoint = require("../../core/Endpoint");
const keys = require("../../keychain.json");
const moment = require("moment-timezone");
const path = require("path");
const fs = require("fs");

class Weather extends Endpoint {
    constructor() {
        super({
            name: "Weather",
            description: "Get the Weather for Greater Western Sydney",
            route: "/api/weather",
            method: "all",
            token: false,
            admin: false,
            mask: false,
            retriever: {
                enable: true,
                interval: 5,
                format: "json",
                url: `https://api.darksky.net/forecast/${keys.darksky}/-33.75,150.70?units=si`
            }
        });
    }

    run(req, res) {
        const store = fs.readFileSync(path.join(__dirname, "..", "..", "storage", `${this.name}.json`));
        const weather = JSON.parse(store).data;
        const icon = this.icon(weather.currently.icon);
        const result = {
            ok: true,
            weather: {
                icon,
                time: moment.unix(weather.currently.time).tz(weather.timezone).format(),
                image: `https://api.kurisubrooks.com/static/weather/icons_v2/${icon}.png`,
                condition: weather.currently.summary,
                temperature: Math.round(weather.currently.temperature),
                feels_like: Math.round(weather.currently.apparentTemperature),
                dewpoint: Math.round(weather.currently.dewPoint),
                humidity: `${Math.round(weather.currently.humidity * 100)}%`,
                pressure: `${Math.round(weather.currently.pressure)} mBar`
            },
            forecast: []
        };

        for (const forecast of weather.daily.data) {
            const date = moment.unix(forecast.time).tz(weather.timezone);
            const icon = this.icon(forecast.icon);

            result.forecast.push({
                date: {
                    time: forecast.time,
                    timezone: weather.timezone,

                    day: date.format("D"),
                    month: date.format("M"),
                    year: date.format("YYYY"),
                    total: date.format("DDD"),

                    display: {
                        day: date.format("dddd"),
                        day_short: date.format("ddd"),
                        month: date.format("MMMM"),
                        month_short: date.format("MMM")
                    },

                    sunrise: moment.unix(forecast.sunriseTime).tz(weather.timezone).format(),
                    sunset: moment.unix(forecast.sunsetTime).tz(weather.timezone).format()
                },
                icon,
                time: date.format(),
                image: `https://api.kurisubrooks.com/static/weather/icons_v2/${icon}.png`,
                condition: forecast.summary.replace(".", ""),
                high: Math.round(forecast.temperatureMax),
                low: Math.round(forecast.temperatureMin),
                feels_like: {
                    high: Math.round(forecast.apparentTemperatureMax),
                    low: Math.round(forecast.apparentTemperatureMin)
                },
                humidity: `${Math.round(forecast.humidity * 100)}%`,
                pressure: `${Math.round(forecast.pressure)} mBar`,
                rain_chance: `${Math.round(forecast.precipProbability * 100)}%`
            });
        }

        return res.send(result);
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
            "partly-cloudy-day": "day_partlycloudy",
            "partly-cloudy-night": "night_partlycloudy",
            "hail": "snow",
            "thunderstorm": "storm",
            "tornado": "wind",
            "unknown": "unknown"
        };

        return condition && condition !== "" && icons[condition]
            ? icons[condition]
            : icons.unknown;
    }
}

module.exports = Weather;
