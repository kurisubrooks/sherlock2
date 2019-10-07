const Endpoint = require('../core/Endpoint');

class PanelLogout extends Endpoint {
  constructor() {
    super({
      name: 'Panel',
      description: 'Admin Panel',
      route: '/panel/logout',
      method: 'GET',
      token: false,
      admin: false,
      mask: true
    });
  }

  async run(req, res) {
    delete req.session.token;
    delete req.session.admin;
    return res.redirect('/panel/login');
  }
}

module.exports = PanelLogout;
