import jwt, {TOKEN_TYPE} from '../auth-token';
import bcrypt from '../bcrypt';
import UserModel, {USER_TYPE} from '../users/models';
import FacebookManager from '../users/facebook-manager';
import {getPromise} from '../database';

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
    return new Promise((resolve, reject) => {
      Promise.all([accessToken, refreshToken])
        .then(tokenSet=> {
          return resolve({
            accessToken: tokenSet[0],
            refreshToken: tokenSet[1]
          });
        })
        .catch(err => {
          return reject(err);
        });
    });
  },
  grantAnonymous: (userId, secret) => {
    const userIdxKey = UserModel.getUserIndexKey({
      userType: USER_TYPE.ANONYMOUS,
      userId
    });
    return UserModel.getUserKey(userIdxKey)
      .then(getPromise)
      .then(userData => {
        return bcrypt.compare(secret, userData.hash)
          .then(() => {
            return userData.key;
          });
      });
  },
  grantFacebook: (facebookToken) => {
    return FacebookManager.getId(facebookToken)
      .then(id => {
        const idxKey = UserModel.getUserIndexKey({
          userType: USER_TYPE.FACEBOOK,
          facebookId: id
        });
        return UserModel.getUserKey(idxKey);
      });
  }
};
export default AuthModel;
