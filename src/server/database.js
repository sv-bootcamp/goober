import levelup from 'levelup';
import leveldown from 'leveldown';
import config from 'config';
import { mockItems, mockItemIndexies, mockImages, mockImageIndexies,
        mockUsers, mockCreatedPosts, mockSavedPosts} from './database-mock-data';

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

export const putPromise = (key, value) => {
  return new Promise((resolve, reject) => {
    db.put(key, value, err => {
      if (err) {
        return reject(err);
      }
      return resolve(key);
    });
  });
};

export const getPromise = key => {
  return new Promise((resolve, reject) => {
    db.get(key, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};

export const fetchPrefix = (prefix, cb) => {
  const values = [];
  let error;
  db.createReadStream({
    start: `${prefix}`,
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
export const fetchValues = (keys = []) => {
  return Promise.all(keys.map(getPromise));
};

export const fetchKeys = (prefix, cb) => {
  const keys = [];
  let error;
  db.createReadStream({
    keys: true,
    values: false,
    start: `${prefix}`,
    end: `${prefix}\xFF`
  }).on('data', (key) => {
    keys.push(key);
  }).on('error', (err) => {
    error = err;
  }).on('close', () => {
    if (error) {
      return cb(error);
    }
    return cb(null, keys);
  });
};

export const initMock = () => {
  return new Promise((resolve, reject) => {
    const arrs = [];
    const ops = [];
    arrs.push(mockItems, mockItemIndexies, mockImages, mockImageIndexies, mockUsers,
      mockCreatedPosts, mockSavedPosts);
    arrs.map((arr) => {
      arr.map((obj) => {
        ops.push({ type: 'put', key: obj.key, value: obj.value });
      });
    });
    db.batch(ops, (err) => {
      if (err) {
        return reject(new Error(err));
      }
      return resolve();
    });
  });
};
