const Endpoint = require('../core/Endpoint');
const Database = require('../core/Database');

class MyPanel extends Endpoint {
  constructor() {
    super({
      name: 'Panel',
      description: 'Admin Panel',
      route: '/panel/me',
      method: 'GET',
      token: false,
      admin: false,
      mask: false
    });
  }

  async run(req, res) {
    if (!req.session.token) return res.redirect('/panel/login');

    const user = await Database.Tables.User.findOne({ where: { token: req.session.token } });

    return res.render('panel/views/layout', {
      title: 'Home',
      content: 'me.ejs',
      data: {
        active: 'me',
        admin: req.session.admin,
        token: req.session.token,
        user
      }
    });
  }
}

module.exports = MyPanel;
