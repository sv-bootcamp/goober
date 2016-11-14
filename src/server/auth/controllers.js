import {APIError} from '../ErrorHandler';
import AuthToken, {TOKEN_TYPE} from '../auth-token';
import AuthModel, {GRANT_TYPE} from './models';
export default {
  refreshToken: (req, res, next) => {
    AuthToken.decode(TOKEN_TYPE.REFRESH, req.body.refreshToken)
    .then((decoded) => {
      if (decoded.tokenType === TOKEN_TYPE.REFRESH) {
        return AuthModel.encodeTokenSet(decoded)
          .then(tokenSet => {
            res.status(200).send(tokenSet);
            return next();
          });
      }
      return next(new APIError(new Error(), {
        statusCode: 400,
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
      const {userId, secret} = req.body;
      grant = AuthModel.grantAnonymous(userId, secret);
      break;
    case GRANT_TYPE.FACEBOOK:
      grant = AuthModel.grantFacebook(req.body.facebookToken);
      break;
    default:
      break;
    }

    grant
    .then(AuthModel.encodeTokenSet)
    .then(tokenSet => {
      res.status(200).send(tokenSet);
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
  },
  validate: (req, res, next) => {
    const {accessToken} = req.body;
    return AuthToken.decode(TOKEN_TYPE.ACCESS, accessToken)
      .then(() => {
        res.status(200).send({
          message: 'Access Token is valid.'
        });
        return next();
      })
      .catch(() => {
        res.status(400).send({
          message: 'Access Token is invalid'
        });
        return next();
      });
  }
};
