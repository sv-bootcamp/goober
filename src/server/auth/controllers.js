import {APIError} from './../ErrorHandler';
import jwt, {TOKEN_TYPE} from './../auth-token';
import AuthModel from './models';
export default {
  refreshToken: (req , res, next) => {
    jwt.decode(TOKEN_TYPE.REFRESH, req.body.refreshToken)
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
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
          return next(new APIError(err, {
            statusCode: 400,
            message: 'Not a valid refresh token'
          }));
        }
        return next(new APIError(err, {
          statusCode: 500,
          message: err.message
        }));
      })
  }
}
