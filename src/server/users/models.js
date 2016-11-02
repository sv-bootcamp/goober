import {KeyUtils} from './../key-utils';
import db from './../database';

export const USER_TYPE = {
  ANONYMOUS: 2,
  FACEBOOK: 1
};

/*
  @TODO you need to add bcrypt to save user secret
 */
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
  addAnonymousUser: (data) => {
    const userKey = UserModel.genUserKey();
    const userValue = {
      type: USER_TYPE.ANONYMOUS,
      key: userKey,
      secret: data.secret
    };
    return UserModel.addUser(userKey, userValue);
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
