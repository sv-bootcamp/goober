import {APIError} from './../ErrorHandler';
import AuthToken, {TOKEN_TYPE} from './../auth-token';
import AuthModel, {GRANT_TYPE} from './models';
export default {
  refreshToken: (req, res, next) => {
    AuthToken.decode(TOKEN_TYPE.REFRESH, req.body.refreshToken)
    .then((decoded) => {
      if (decoded.type === TOKEN_TYPE.REFRESH) {
        return AuthModel.encodeTokenSet(decoded.user)
          .then(tokenSet => {
            res.send(tokenSet);
            return next();
          });
      }
      return next(new APIError(new Error(), {
        status: 400,
        message: 'Not a valid token type'
      }));
    })
    .catch(err => {
      return next(new APIError(err, {
        statusCode: 400,
        message: 'Not a valid refresh token'
      }));
    });
  },
  grant: (req, res, next) => {
    const {grantType} = req.body;
    let grant;
    switch (grantType) {
    case GRANT_TYPE.ANONYMOUS:
      grant = AuthModel.grantAnonymous(req.body.userSecret);
      break;
    case GRANT_TYPE.FACEBOOK:
      console.log(req.body.facebookToken);
      grant = AuthModel.grantFacebook(req.body.facebookToken);
      break;
    default:
      break;
    }

    grant
    .then(userKey => {
      console.log('encodeTokenSet');
      console.log(userKey);
      return AuthModel.encodeTokenSet(userKey)
    })
    .then(tokenSet => {
      console.log('tokenSet');
      console.log(tokenSet);
      res.send(tokenSet);
      return next();

    })
    .catch(err => {
      if (err.notFound) {
        return next(new APIError(err, {
          statusCode: 400,
          message: 'wrong secret'
        }));
      }
      return next(
        new APIError(err, {
          statusCode: 500,
          message: err.message
        })
      );
    });
  }
};
