import {KeyUtils} from './../key-utils';
import bcrypt from './../bcrypt';
import db from './../database';

export const USER_TYPE = {
  ANONYMOUS: 0,
  FACEBOOK: 1
};

const UserModel = {
  addUser: (key, value) => {
    return new Promise((resolve, reject) => {
      db.put(key, value, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(key);
      });
    });
  },
  getUser: (key) => {
    return new Promise((resolve, reject) => {
      db.get(key, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  },
  addAnonymousUser: (data) => {
    const userKey = UserModel.genUserKey();
    const userValue = {
      type: USER_TYPE.ANONYMOUS,
      name: 'guest',
      key: userKey
    };
    return bcrypt.hash(data.secret)
      .then(hash => {
        userValue.secret = hash;
        return UserModel.addUser(userKey, userValue);
      });
  },
  addFacebookUser: (data) => {
    const userKey = UserModel.genUserKey();
    const userValue = {
      type: USER_TYPE.FACEBOOK,
      key: userKey,
      facebookToken: data.facebookToken
    };

    // @TODO get facebook info using facebook graphAPI and save it.

    return UserModel.addUser(userKey, userValue);
  },
  genUserKey: () => {
    const timeHash = KeyUtils.genTimeHash();
    return `user-${timeHash}`;
  }
};
export default UserModel;
