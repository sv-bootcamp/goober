import {APIError} from '../ErrorHandler';
import AuthToken, {TOKEN_TYPE} from '../auth-token';
import AuthModel, {GRANT_TYPE} from './models';
import {FACEBOOK_ERROR} from '../users/facebook-manager';

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
      return next(new APIError(new Error('Not a valid token type'), 400));
    }).catch(err => next(new APIError(new Error('Not a valid token type'), 400)));
  },
  grant: (req, res, next) => {
    let {userKey, grantType} = req.body;
    let grant;
    switch (grantType) {
    case GRANT_TYPE.ANONYMOUS:
      const {userSecret} = req.body;
      grant = AuthModel.grantAnonymous(userKey, userSecret);
      break;
    case GRANT_TYPE.FACEBOOK:
      const {facebookToken} = req.body;
      grant = AuthModel.grantFacebook(facebookToken);
      break;
    default:
      break;
    }

    grant
    .then(tokenPayload => {
      userKey = userKey || tokenPayload.userKey;
      return tokenPayload;
    })
    .then(AuthModel.encodeTokenSet)
    .then(tokenSet => {
      tokenSet.userKey = userKey;
      res.status(200).send(tokenSet);
      return next();
    })
    .catch(err => {
      if (err.type === FACEBOOK_ERROR.OAUTH_EXCEPTION) {
        return next(new APIError(new Error('wrong facebook access token'), 400));
      } else if (err.notFound) {
        return next(new APIError(new Error('wrong secret'), 400));
      } else if (err.message === 'wrong facebook token') {
        return next(new APIError(err, 400));
      }
      return next(new APIError(err));
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
