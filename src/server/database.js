import levelup from 'levelup';
import leveldown from 'leveldown';
import config from 'config';

export default levelup(config.database, {valueEncoding: 'json'});

export const clearDB = (cb)=>{
  leveldown.destroy(config.database, cb);
};
