import db from '../database';

export default class ImageManager {
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
