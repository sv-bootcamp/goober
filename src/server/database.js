import levelup from 'levelup';
import leveldown from 'leveldown';
import config from 'config';
import { mockItems, mockItemIndexies, mockImages, mockImageIndexies,
        mockUsers} from './database-mock-data';

const db = levelup(config.database, {valueEncoding: 'json'});
export default db;

export const clearDB = () => {
  return new Promise((resolve, reject) => {
    db.close(() => {
      leveldown.destroy(config.database, (err) => {
        if (err) {
          return reject(err);
        }
        return db.open(resolve);
      });
    });
  });
};

export const fetchPrefix = (prefix, cb) => {
  const values = [];
  let error;
  db.createReadStream({
    start: `${prefix}\x00`,
    end: `${prefix}\xFF`
  }).on('data', (data) => {
    values.push(data.value);
  }).on('error', (err) => {
    error = err;
  }).on('close', () => {
    if (error) {
      return cb(error);
    }
    return cb(null, values);
  });
};

export const initMock = () => {
  return new Promise((resolve, reject)=>{
    const ops = [];
    for (const key in mockItems) {
      if (mockItems.hasOwnProperty(key)) {
        ops.push({
          type: 'put',
          key,
          value: mockItems[key]
        });
      }
    }
    for (const key in mockItemIndexies) {
      if (mockItemIndexies.hasOwnProperty(key)) {
        ops.push({
          type: 'put',
          key,
          value: mockItemIndexies[key]
        });
      }
    }
    for (const key in mockImages) {
      if (mockImages.hasOwnProperty(key)) {
        ops.push({
          type: 'put',
          key,
          value: mockImages[key]
        });
      }
    }
    for (const key in mockImageIndexies) {
      if (mockImageIndexies.hasOwnProperty(key)) {
        ops.push({
          type: 'put',
          key,
          value: mockImageIndexies[key]
        });
      }
    }
    for (const key in mockUsers) {
      if (mockUsers.hasOwnProperty(key)) {
        ops.push({
          type: 'put',
          key,
          value: mockUsers[key]
        });
      }
    }

    db.batch(ops, (err) => {
      if (err) {
        return reject(new Error(err));
      }
      return resolve();
    });
  });
};
