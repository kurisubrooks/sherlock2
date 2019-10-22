const Endpoint = require('../../core/Endpoint');
const Database = require('../../core/Database');

class RegistrationHandler extends Endpoint {
  constructor() {
    super({
      name: 'Registration',
      description: 'Handles User Registration',
      route: '/api/register',
      method: 'POST',
      token: false,
      admin: false,
      mask: true
    });
  }

  async run(req, res, data) {
    if (!data.email) return res.send({ ok: false, error: 'Missing Email' });
    if (!data.username) return res.send({ ok: false, error: 'Missing Username' });
    if (!data.password) return res.send({ ok: false, error: 'Missing Password' });
    if (Buffer.byteLength(data.password) > 42) return res.send({ ok: false, error: 'Password Too Long' });
    if (!data.auth) return res.send({ ok: false, error: 'Auth Key Required' });

    // Validate Registration Key
    if (!await Database.validateRegKey(data.auth)) return res.send({ ok: false, error: 'Invalid Auth Key' });

    // Handle User Generation
    return Database.newUser({
      auth: data.auth,
      email: data.email,
      username: data.username,
      password: data.password
    }).then(data => {
      if (!data.ok) return res.send(data);

      req.session.token = data.token;
      req.session.admin = data.admin;

      this.log(`User Created: ${data.username}`, 'debug');
      return res.send(data);
    });
  }
}

module.exports = RegistrationHandler;
