import jwt, {TOKEN_TYPE} from '../auth-token';
import bcrypt from '../bcrypt';
import {USER_TYPE} from '../users/models';
import FacebookManager, {FacebookModel} from '../users/facebook-manager';
import {getPromise} from '../database';

export const GRANT_TYPE = {
  ANONYMOUS: 'anonymous',
  FACEBOOK: 'facebook'
};

const AuthModel = {
  encodeTokenSet: ({userType, userKey}) => {
    const accessToken = jwt.encode(TOKEN_TYPE.ACCESS, {
      tokenType: TOKEN_TYPE.ACCESS,
      userKey,
      userType
    });
    const refreshToken = jwt.encode(TOKEN_TYPE.REFRESH, {
      tokenType: TOKEN_TYPE.REFRESH,
      userKey,
      userType
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
  grantAnonymous: (userKey, userSecret) => {
    return getPromise(userKey)
      .then(userData => {
        return bcrypt.compare(userSecret, userData.hash)
          .then(() => {
            return {
              userKey: userData.key,
              userType: USER_TYPE.ANONYMOUS
            };
          });
      });
  },
  grantFacebook: (facebookToken) => {
    return FacebookManager.getId(facebookToken)
      .then(FacebookModel.getIdxKey)
      .then(getPromise)
      .then(idxData => {
        return {
          userKey: idxData.key,
          userType: USER_TYPE.FACEBOOK
        };
      });
  }
};
export default AuthModel;
