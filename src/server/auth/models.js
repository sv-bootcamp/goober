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
        console.log('promise all');
        console.log(tokenSet);
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
    return UserModel.getUserKey(idxKey);
  },
  grantFacebook: (facebookToken) => {
    return FacebookManager.getId(facebookToken)
      .then(id => {
        console.log('id');
        console.log('compare');
        console.log(id === '109768169505525');
        console.log(id);
        const idxKey = UserModel.getUserIndexKey({
          userType: USER_TYPE.FACEBOOK,
          facebookId: id
        });
        console.log('key');
        console.log(idxKey);
        return UserModel.getUserKey(idxKey);
      });
  }
};
export default AuthModel;
