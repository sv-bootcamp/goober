import db from '../database';

export default class ImageManager {
  static fetchPrefix(prefix, cb) {
    const keys = [];
    let error;
    db.createReadStream({
      start: `${prefix}\x00`,
      end: `${prefix}\xFF`
    }).on('data', (data) => {
      if (!data.value.key) {
        error = new Error('No id field in value');
        return;
      }
      keys.push(data.value.key);
      return;
    }).on('error', (err) => {
      error = err;
    }).on('close', () => {
      if (error) {
        return cb(error);
      }
      return cb(null, keys);
    });
  }
}
