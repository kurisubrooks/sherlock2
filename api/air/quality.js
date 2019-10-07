const Endpoint = require('../../core/Endpoint');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

const titles = [
  'Very Good',
  'Good',
  'Fair',
  'Poor',
  'Very Poor',
  'Hazardous'
];

const colours = [
  '#1D87E4',
  '#4CAF50',
  '#FAA800',
  '#E53935',
  '#BB1410',
  '#7D57C1'
];

class AirQuality extends Endpoint {
  constructor() {
    super({
      name: 'AirQuality',
      description: 'Check the local air quality',
      route: '/api/air',
      method: 'all',
      disabled: true,
      token: false,
      admin: false,
      mask: false,
      retriever: {
        name: 'quality',
        format: 'html',
        interval: 5,
        url: `http://airquality.environment.nsw.gov.au/aquisnetnswphp/getPage.php?reportid=1`
      }
    });
  }

  getIndex(num) {
    //   0  => 25  = 0
    //  25 <=> 50  = 1
    //  50 <=> 100 = 2
    // 100 <=> 150 = 3
    // 150 <=> 200 = 4
    // 200 <=     = 5

    if (num >= 200) return 5;
    if (num >= 25) return Math.ceil(num / 50);
    return 0;
  }

  run(req, res) {
    const store = fs.readFileSync(path.join(__dirname, '..', '..', 'storage', `${this.retriever.name}.${this.retriever.format}`));

    const $ = cheerio.load(store);
    const pm10 = Number($('.aqi tr:nth-child(10) > td:nth-child(8)').text());
    const pm25 = Number($('.aqi tr:nth-child(10) > td:nth-child(9)').text());

    if (isNaN(pm10 || pm25)) {
      return res.status(500).send({ ok: false, error: 'Internal Server Error' });
    }

    const index = this.getIndex(pm25);

    const result = {
      ok: true,
      aqi: {
        index,
        pm10, pm25,
        title: titles[index],
        colour: colours[index]
      }
    };

    return res.send(result);
  }
}

module.exports = AirQuality;
