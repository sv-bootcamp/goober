import jwt, {TOKEN_TYPE} from './../auth-token';
import {KeyUtils} from './../key-utils';
import db from './../database';

// const GRANT_TYPE = {
//   'ANONYMOUS': 'anonymous',
//   'FACEBOOK': 'facebook'
// };

export const USER_TYPE = {
  ANONYMOUS: 2,
  FACEBOOK: 1
};

/*
  @TODO you need to add bcrypt to save user secret
 */
const userModel = {
  // authenticate: (req, res, next) => {
  //   const bearerToken = req.headers.Authorization;
  //   const jwtToken = bearerToken.split(' ')[1];
  //   jwt.decode(jwtToken)
  //     .then((paylaod) => {
  //     });
  // },
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
    const userKey = userModel.genUserKey();
    const userValue = {
      type: USER_TYPE.ANONYMOUS,
      key: userKey,
      secret: data.secret
    };
    return userModel.addUser(userKey, userValue);
  },
  addFacebookUser: (data) => {
    const userKey = userModel.genUserKey();
    const userValue = {
      type: USER_TYPE.FACEBOOK,
      key: userKey,
      facebookToken: data.facebookToken
    };

    // @TODO get facebook info using facebook graphAPI and save it.

    return userModel.addUser(userKey, userValue);
  },
  genUserKey: () => {
    const timeHash = KeyUtils.genTimeHash();
    return `user-${timeHash}`;
  },
  getTokenSet: (userKey) => {
    const accessToken = jwt.encode(TOKEN_TYPE.ACCESS, {
      type: TOKEN_TYPE.ACCESS,
      user: userKey
    });
    const refreshToken = jwt.encode(TOKEN_TYPE.REFRESH, {
      type: TOKEN_TYPE.REFRESH,
      user: userKey
    });
    return Promise.all([accessToken, refreshToken]);
  }
};
export default userModel;
