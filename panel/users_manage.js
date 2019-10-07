const Endpoint = require('../core/Endpoint');
const Database = require('../core/Database');

class PanelManageUsers extends Endpoint {
  constructor() {
    super({
      name: 'Panel',
      description: 'Admin Panel',
      route: '/panel/users/manage',
      method: 'GET',
      token: false,
      admin: true,
      mask: false
    });
  }

  async run(req, res) {
    if (!req.session.token) return res.redirect('/panel/login');

    const users = await Database.Models.User.findAll();

    return res.render('panel/views/layout', {
      title: 'Manage Users',
      content: 'users_manage.ejs',
      users,
      data: {
        admin: req.session.admin,
        active: 'users_manage'
      }
    });
  }
}

module.exports = PanelManageUsers;
