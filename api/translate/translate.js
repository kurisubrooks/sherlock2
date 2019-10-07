const Endpoint = require('../../core/Endpoint');
const { toUpper } = require('../../core/Util/Util');
const Logger = require('../../core/Util/Logger');
const request = require('request-promise');
const langs = require('./languages.json');

class Translate extends Endpoint {
  constructor() {
    super({
      name: 'Translate',
      description: 'Translates Text to/from a language',
      route: '/api/translate',
      token: true,
      admin: false,
      mask: false
    });
  }

  async run(req, res, data) {
    if (!data.query) {
      return this.error(res, { code: 400, message: "Missing 'query' field" });
    }

    if (!data.to) {
      return this.error(res, { code: 400, message: "Missing 'to' lang field" });
    }

    if (!this.validate(data.to)) {
      return this.error(res, { code: 400, message: "Unknown 'to' Language" });
    }

    if (data.from && data.from !== '') {
      if (!this.validate(data.from)) {
        return this.error(res, { code: 400, message: "Unknown 'from' Language" });
      }
    }

    const to_lang = this.validate(data.to).code;
    const from_lang = data.from ? this.validate(data.from).code : 'auto';
    const query = this.slicer(data.query);

    const response = await request({
      headers: { 'User-Agent': 'Mozilla/5.0' },
      uri: 'http://translate.googleapis.com/translate_a/single',
      qs: {
        client: 'gtx',
        dt: 't',
        sl: from_lang,
        tl: to_lang,
        q: query // eslint-disable-line id-length
      }
    }).catch(err => {
      console.log('translate error', err); // eslint-disable-line no-console
      return this.error(res, { code: 500, message: 'Internal Server Error' });
    });

    const output = JSON.parse(response.replace(/,+/g, ','));

    const payload = {
      ok: true,
      to: this.validate(data.to || 'en'),
      from: this.validate(output[2]),
      query: data.query,
      result: output[0][0][0]
    };

    if (res && !data.referral) {
      res.send(payload);
    }

    return payload;
  }

  error(res, query) {
    if (res) {
      res.status(query.code).send({ ok: false, error: query.message });
    }

    Logger.error(toUpper(this.name), query.message);
    return query.message;
  }

  validate(query) {
    if (!query) return null;

    for (const obj of langs) {
      const input = query.toLowerCase();
      const item = Object.values(obj).map(val => val.toLowerCase());
      if (!item.includes(input)) continue;
      return obj;
    }

    return null;
  }

  slicer(query) {
    const values = {
      '。': '. ',
      '、': ', ',
      '？': '? ',
      '！': '! ',
      '「': '"',
      '」': '" ',
      '\u3000': ' '
    };

    return query
      .replace(/\r?\n|\r/g, ' ')
      .replace(new RegExp(Object.keys(values).join('|'), 'ig'), match => values[match]);
  }
}

module.exports = Translate;
