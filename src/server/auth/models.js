import jwt, {TOKEN_TYPE} from './../auth-token';

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
        }
      })
  }
};
export default AuthModel;
