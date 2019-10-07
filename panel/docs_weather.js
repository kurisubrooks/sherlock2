const Endpoint = require('../core/Endpoint');

class WeatherDocs extends Endpoint {
  constructor() {
    super({
      name: 'Docs',
      description: 'Documentation',
      route: '/panel/docs/weather',
      method: 'GET',
      token: false,
      admin: false,
      mask: false
    });
  }

  async run(req, res) {
    if (!req.session || !req.session.token) return res.redirect('/panel/login');
    return res.render('panel/views/layout', {
      title: 'Weather',
      content: 'docs_weather.ejs',
      data: {
        admin: req.session.admin,
        active: 'docs_weather'
      }
    });
  }
}

module.exports = WeatherDocs;
