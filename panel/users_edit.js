const Endpoint = require('../core/Endpoint');
const Database = require('../core/Database');

class PanelEditUser extends Endpoint {
  constructor() {
    super({
      name: 'Panel',
      description: 'Admin Panel',
      route: '/panel/users/edit',
      method: 'GET',
      token: false,
      admin: true,
      mask: false
    });
  }

  async run(req, res, data) {
    if (!req.session.token) return res.redirect('/panel/login');

    const user = await Database.Tables.User.findOne({ where: { username: data.username } });

    let info;
    if (user) {
      info = {
        admin: user.admin,
        disabled: user.disabled,
        email: user.email,
        username: user.username,
        token: user.token
      };
    }

    return res.render('panel/views/layout', {
      title: 'Edit User',
      content: 'users_edit.ejs',
      data: {
        admin: req.session.admin,
        active: 'users_manage',
        users: user ? true : null,
        user: info
      }
    });
  }
}

module.exports = PanelEditUser;
