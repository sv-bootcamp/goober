import levelup from 'levelup';
import config from 'config';

export default levelup(config.database, {valueEncoding: 'json'});
