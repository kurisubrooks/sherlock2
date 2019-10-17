const Endpoint = require('../../core/Endpoint');
const request = require('request-promise');
const GIF = require('gifencoder');
const { createCanvas, Image } = require('canvas');
const path = require('path');
const fs = require('fs');

const types = [
  'animated',
  'static'
];

const list = {
  adelaide: {
    id: '064',
    type: 'radar',
    tz: 'Australia/Adelaide'
  },
  sydney: {
    id: '071',
    type: 'radarz',
    tz: 'Australia/Sydney'
  },
  canberra: {
    id: '040',
    type: 'radarz',
    tz: 'Australia/Sydney'
  },
  melbourne: {
    id: '001',
    type: 'radarzz',
    tz: 'Australia/Melbourne'
  }
};

class Radar extends Endpoint {
  constructor() {
    super({
      name: 'Radar',
      description: 'Generates Radar Image for Sydney',
      route: '/api/radar',
      method: 'all',
      token: false,
      admin: false,
      mask: false
    });
  }

  async run(req, res, data) {
    const type = data.type ? data.type : 'static';
    const place = data.id ? list[data.id] : list.sydney;
    const frames = type === 'static' ? 1 : 8;

    if (data.type) {
      if (!types[types.indexOf(data.type)]) {
        return res.status(400).send({ ok: false, error: 'Unknown Image Type' });
      }
    }

    if (data.id) {
      if (!place) {
        return res.status(400).send({ ok: false, error: 'Unsupported Location' });
      }
    }

    return request({
      headers: { 'User-Agent': 'Mozilla/5.0' },
      uri: 'http://data.weatherzone.com.au/json/animator/',
      json: true,
      qs: {
        lt: 'radar',
        lc: place.id,
        type: 'radar',
        mt: 'radsat_640',
        mlt: place.type,
        mlc: place.id,
        frames: frames,
        md: '640x480',
        radardimensions: '640x480',
        df: 'EEE HH:mm z',
        tz: place.tz
      }
    }, async(err, _, response) => {
      if (err) return this.handleError(err, res);

      const encoder = new GIF(640, 480);
      const canvas = createCanvas(640, 480);
      const ctx = canvas.getContext('2d');
      const frame = new Image();
      const terrain = new Image();
      const locations = new Image();

      terrain.src = fs.readFileSync(path.join(__dirname, 'terrain', `${place.id}.jpg`));
      locations.src = fs.readFileSync(path.join(__dirname, 'locations', `${place.id}.png`));

      if (type === 'animated') {
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(220);
        encoder.setQuality(100);

        let count = 0;
        const frames = { };
        const queue = [];

        response.frames.sort((a, b) => a - b);

        for (const item of response.frames) {
          const id = ++count;

          queue.push(new Promise(resolve => {
            return request.get({
              headers: { 'User-Agent': 'Mozilla/5.0' },
              uri: item.image,
              encoding: null
            }, (error, response, body) => {
              if (error) if (error) return this.handleError(error, res);

              frames[id] = { radar: body, id: id, item: item, time: item.timestamp_string };

              return resolve();
            });
          }));
        }

        await Promise.all(queue);

        for (const thisFrame of Object.values(frames)) {
          frame.src = thisFrame.radar;

          ctx.drawImage(terrain, 0, 0);
          ctx.drawImage(frame, 0, 0);
          ctx.drawImage(locations, 0, 0);

          ctx.font = '16px sans-serif';
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'right';
          ctx.fillText(thisFrame.time, 628, 25);
          ctx.fillText(`Frame: ${thisFrame.id}`, 628, 42.5);

          if (thisFrame.id === count) {
            encoder.setDelay(2250);
          }

          encoder.addFrame(ctx);
        }

        encoder.finish();
        return res.type('gif').send(encoder.out.getData());
      } else if (type === 'static') {
        const thisFrame = response.frames[Number(frames) - 1];
        return request.get({
          headers: { 'User-Agent': 'Mozilla/5.0' },
          uri: thisFrame.image,
          encoding: null
        }, (error, response, body) => {
          if (error) return this.handleError(error, res);

          frame.src = body;

          ctx.drawImage(terrain, 0, 0);
          ctx.drawImage(frame, 0, 0);
          ctx.drawImage(locations, 0, 0);

          ctx.font = '16px sans-serif';
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'right';
          ctx.fillText(thisFrame.timestamp_string, 628, 25);

          return res.type('png').send(canvas.toBuffer());
        });
      } else {
        return res.status(400).send({ ok: false, error: 'Unknown Image Type' });
      }
    });
  }

  handleError(error, res) {
    res.status(500).send({ ok: false, error: 'Internal Server Error' });
    return this.error(error);
  }
}

module.exports = Radar;
