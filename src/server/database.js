import levelup from 'levelup';
import leveldown from 'leveldown';
import config from 'config';

const db = levelup(config.database, {valueEncoding: 'json'});
export default db;

export const clearDB = (cb) => {
  db.close(() => {
    leveldown.destroy(config.database, (err) => {
      if (err) {
        // error
      }
      db.open(cb);
    });
  });
};
