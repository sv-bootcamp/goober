import jwt, {TOKEN_TYPE} from './../auth-token';
import bcrypt from './../bcrypt';
import UserModel from './../users/models';

export const GRANT_TYPE = {
  ANONYMOUS: 'anonymous',
  FACEBOOK: 'facebook'
};

const AuthModel = {
  encodeTokenSet: (userKey) => {
    const accessToken = jwt.encode(TOKEN_TYPE.ACCESS, {
      type: TOKEN_TYPE.ACCESS,
      user: userKey
    });
    const refreshToken = jwt.encode(TOKEN_TYPE.REFRESH, {
      type: TOKEN_TYPE.REFRESH,
      user: userKey
    });
    return Promise.all([accessToken, refreshToken])
      .then((tokenSet)=>{
        return {
          accessToken: tokenSet[0],
          refreshToken: tokenSet[1]
        };
      });
  },
  grantAnonymous: (userKey, userSecret) => {
    return new Promise((resolve, reject) => {
      UserModel.getUser(userKey)
      .then(data => {
        return bcrypt.compare(userSecret, data.secret);
      })
      .then(res => {
        if (res) {
          return resolve(userKey);
        }
        return reject(new Error('notgranted'));
      })
      .catch(err => {
        reject(err);
      });
    });
  },
  grantFacebook: (userKey, facebookToken) => {
    return new Promise((resolve, reject) => {
      UserModel.getUser(userKey)
      .then((data) => {
        // @TODO encrypt facebook Token
        return data.facebookToken === facebookToken;
      })
      .then(res => {
        if (res) {
          return resolve(userKey);
        }
        return reject(new Error('notgranted'));
      })
      .catch(err => {
        reject(err);
      });
    });
  }
};
export default AuthModel;
