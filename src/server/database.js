import levelup from 'levelup';
import config from 'config';

const db = levelup(config.database, {valueEncoding: 'json'});

db.get('itemIncrement', (err) => {
  if (err && err.type === 'NotFoundError') {
    db.put('itemIncrement', 0);
  }
});

export default db;

