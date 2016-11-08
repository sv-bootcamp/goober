import jwt, {TOKEN_TYPE} from './../auth-token';
import UserModel, {FacebookManager, USER_TYPE} from './../users/models';


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
  grantAnonymous: (userSecret) => {
    const idxKey = UserModel.getUserIndexKey({
      userType: USER_TYPE.ANONYMOUS,
      secret: userSecret
    });
    return UserModel.getUser(idxKey)
      .then(data => {
        return data.key;
      });
  },
  grantFacebook: (facebookToken) => {
    return FacebookManager.getId(facebookToken)
      .then(id => {
        return UserModel.getUserIndexKey({
          userType: USER_TYPE.FACEBOOK,
          facebookId: id
        });
      })
      .then(UserModel.getUser)
      .then(ref => {
        return ref.key;
      });
  }
};
export default AuthModel;