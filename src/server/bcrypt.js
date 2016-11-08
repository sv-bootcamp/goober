import nodeBcrypt from 'bcrypt';
import config from 'config';

const SALT_ROUNDS = process.env.SALT_ROUNDS || config.SALT_ROUNDS;

const bcrypt = {
  hash: password => {
    return new Promise((resolve, reject) => {
      nodeBcrypt.hash(password, Number(SALT_ROUNDS), (err, hash) => {
        if (err) {
          return reject(err);
        }
        return resolve(hash);
      });
    });
  },
  compare: (password, hash) => {
    return new Promise((resolve, reject) => {
      nodeBcrypt.compare(password, hash, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
};

export default bcrypt;
