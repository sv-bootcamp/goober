import levelup from 'levelup';
import config from 'config';

const db = levelup(config.database, {valueEncoding: 'json'});

export default db;
