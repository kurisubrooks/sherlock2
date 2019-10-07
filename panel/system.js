const Endpoint = require('../core/Endpoint');

class PanelSystem extends Endpoint {
  constructor() {
    super({
      name: 'Panel',
      description: 'Admin Panel',
      route: '/panel/system',
      method: 'GET',
      token: false,
      admin: true,
      mask: false
    });
  }

  async run(req, res) {
    if (!req.session.token) return res.redirect('/panel/login');
    return res.render('panel/views/layout', {
      title: 'System',
      content: 'system.ejs',
      data: {
        node: process.version.replace('v', ''),
        memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        admin: req.session.admin,
        active: 'system'
      }
    });
  }
}

module.exports = PanelSystem;
