const Logger = require('./Logger');
const crypto = require('crypto');

class Util {
  constuctor() {
    throw new Error(`${this.constructor.name} class cannot be instantiated`);
  }

  static error(res, error) {
    Logger.error('Unknown', error);
    res.send({ ok: false, error: error });
    return false;
  }

  static toUpper(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static generateToken() {
    return crypto.randomBytes(Math.ceil(32 / 2)).toString('hex');
  }
}

module.exports = Util;
