const Endpoint = require("../../core/Endpoint");
const moment = require("moment");
const keys = require("../../keychain.json");
const path = require("path");
const fs = require("fs");

class Weather extends Endpoint {
    constructor() {
        super({
            name: "Weather",
            description: "Get the Weather for Western Sydney",
            route: "/api/weather",
            method: "all",
            token: false,
            retriever: {
                enable: true,
                interval: 5,
                format: "json",
                url: `http://api.wunderground.com/api/${keys.wunderground}/conditions/forecast10day/astronomy/q/Australia/Penrith.json`
            }
        });
    }

    run(req, res) {
        const store = fs.readFileSync(path.join(__dirname, "..", "..", "storage", `${this.name}.json`));
        const weather = JSON.parse(store).data;

        if (!weather.current_observation) {
            res.status(500).send({ ok: false, error: "Internal Server Error" });
            return this.error("Missing Data");
        }

        const icon_code = this.icon(weather.current_observation.icon, moment.unix(weather.current_observation.local_epoch).format("HHMM"), weather.sun_phase);

        const result = {
            ok: true,
            location: {
                full: weather.current_observation.display_location.full,
                city: weather.current_observation.display_location.city,
                state: weather.current_observation.display_location.state,
                country: weather.current_observation.display_location.country_iso3166,
                lat: weather.current_observation.display_location.latitude,
                long: weather.current_observation.display_location.longitude,
                time: weather.current_observation.local_epoch,
                timezone: weather.current_observation.local_tz_long,
                offset: weather.current_observation.local_tz_offset
            },
            weather: {
                icon: icon_code,
                image: `https://api.kurisubrooks.com/static/weather/icons/${icon_code}_dark.png`,
                condition: weather.current_observation.weather,
                temperature: Math.round(Number(weather.current_observation.temp_c)),
                feels_like: Math.round(Number(weather.current_observation.feelslike_c)),
                dewpoint: Number(weather.current_observation.dewpoint_c),
                humidity: weather.current_observation.relative_humidity,
                pressure: `${weather.current_observation.pressure_mb} mBar`,
                visibility: `${weather.current_observation.visibility_km} km`,
                UV: Number(weather.current_observation.UV),
                wind: {
                    chill: weather.current_observation.windchill_c,
                    direction: weather.current_observation.wind_dir,
                    degrees: Number(weather.current_observation.wind_degrees),
                    gust: `${weather.current_observation.wind_gust_kph} km/h`,
                    kph: `${weather.current_observation.wind_kph} km/h`
                },
                precipitation: {
                    hour: `${weather.current_observation.precip_1hr_metric} mm`,
                    today: `${weather.current_observation.precip_today_metric} mm`
                }
            },
            forecast: []
        };

        for (const object of weather.forecast.simpleforecast.forecastday) {
            result.forecast.push({
                date: {
                    day: object.date.day,
                    month: object.date.month,
                    year: object.date.year,
                    total: object.date.yday,
                    display: {
                        day: object.date.weekday,
                        day_short: object.date.weekday_short,
                        month: object.date.monthname,
                        month_short: object.date.monthname_short
                    },
                    time: object.date.epoch,
                    timezone: object.date.tz_long
                },
                icon: this.icon(object.icon),
                image: `https://api.kurisubrooks.com/static/weather/icons/${this.icon(object.icon)}_dark.png`,
                condition: object.conditions,
                high: Math.round(Number(object.high.celsius)),
                low: Math.round(Number(object.low.celsius)),
                humidity: `${object.avehumidity}%`,
                rain_chance: `${object.pop}%`,
                rainfall: `${object.qpf_allday.mm} mm`,
                snowfall: `${object.snow_allday.cm} cm`,
                wind: {
                    max: `${object.maxwind.kph} km/h`,
                    average: `${object.avewind.kph} km/h`,
                    direction: object.avewind.dir,
                    degrees: Number(object.avewind.degrees)
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

        const icons = {
            "chanceflurries": "flurries",
            "chancerain": "showers_rain",
            "chancesleat": "wintry_mix_rain_snow",
            "chancesnow": "snow_showers_snow",
            "chancetstorms": day ? "isolated_scattered_tstorms_day" : "isolated_scattered_tstorms_night",
            "clear": day ? "clear_day" : "clear_night",
            "cloudy": "cloudy",
            "flurries": "flurries",
            "fog": "haze_fog_dust_smoke",
            "hazy": "haze_fog_dust_smoke",
            "mostlycloudy": day ? "mostly_cloudy_day" : "mostly_cloudy_night",
            "mostlysunny": "mostly_sunny",
            "partlycloudy": day ? "partly_cloudy" : "partly_cloudy_night",
            "partlysunny": "partly_sunny",
            "rain": "showers_rain",
            "sleat": "wintry_mix_rain_snow",
            "snow": "snow_showers_snow",
            "sunny": "clear_day",
            "tstorms": day ? "isolated_scattered_tstorms_day" : "isolated_scattered_tstorms_night",
            "unknown": "unknown"
        };

        return condition && condition !== "" && icons[condition] ? icons[condition] : icons.unknown;
    }
}

module.exports = Weather;
