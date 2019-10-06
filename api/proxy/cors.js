const Endpoint = require('../../core/Endpoint');
const request = require('request');

class CORS extends Endpoint {
  constructor() {
    super({
      name: 'CORS',
      description: 'Route/Proxy things',
      route: '/api/proxy',
      method: 'GET',
      token: true,
      admin: false,
      mask: false
    });
  }

  run(req, res, data) {
    res.header('Access-Control-Allow-Methods', req.header('Access-Control-Request-Method'));
    res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));

    return request(decodeURIComponent(data.url), (error, response, body) => {
      if (error) {
        console.error(`Proxy Error: ${response.statusCode}`);
      }

      res.setHeader('Content-Type', res.header('Content-Type'));
      return res.send(body);
    });
  }
}

module.exports = CORS;
