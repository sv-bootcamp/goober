import levelup from 'levelup';
import config from 'config';

const db = levelup(config.database, {valueEncoding: 'json'});
export default db;

export const clearDB = (cb) => {
  const errorList = [];
  db.createReadStream({
    start: '0',
    end: '\xFF'
  }).on('data', (data) => {
    db.del(data.key, (err) => {
      if (err) {
        errorList.push(err);
      }
    });
  }).on('close', () => {
    if (errorList.length > 0) {
      return cb(errorList);
    }
    return cb();
  });
};
