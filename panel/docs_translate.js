const Endpoint = require('../core/Endpoint');

class TranslateDocs extends Endpoint {
  constructor() {
    super({
      name: 'Docs',
      description: 'Documentation',
      route: '/panel/docs/translate',
      method: 'GET',
      token: false,
      admin: false,
      mask: false
    });
  }

  async run(req, res) {
    if (!req.session || !req.session.token) return res.redirect('/panel/login');
    return res.render('panel/views/layout', {
      title: 'Translate',
      content: 'docs_translate.ejs',
      data: {
        admin: req.session.admin,
        active: 'docs_translate'
      }
    });
  }
}

module.exports = TranslateDocs;
