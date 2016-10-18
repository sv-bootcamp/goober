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

  static fetchImage(keys = [], cb) {
    const promises = [];
    const values = [];
    for (const key of keys) {
      promises.push(new Promise((resolve, reject) => {
        db.get(key, (err, value) => {
          if (err) {
            reject();
            return;
          }
          value.key = key;
          values.push(value);
          resolve();
        });
      }));
    }
    Promise.all(promises).then(() => {
      cb(null, values);
    }).catch(() => {
      cb(new Error('database error'));
    });
  }
}
