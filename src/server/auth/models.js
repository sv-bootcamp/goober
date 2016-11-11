import jwt, {TOKEN_TYPE} from './../auth-token';
import UserModel, {FacebookManager, USER_TYPE} from './../users/models';

export const GRANT_TYPE = {
  ACCESS_TOKEN: 'accessToken',
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
          })
        })
        .catch(err => {
          return reject(err);
        });
    });
  },
  grantAnonymous: (secret) => {
    const idxKey = UserModel.getUserIndexKey({
      userType: USER_TYPE.ANONYMOUS,
      secret
    });
    return UserModel.getUserKey(idxKey);
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
