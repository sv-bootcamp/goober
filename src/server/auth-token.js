import jwt from 'jsonwebtoken';
import config from 'config';
import {APIError} from './ErrorHandler';
import {USER_PERMISSION} from './users/models';

export const TOKEN_TYPE = {
  ACCESS: 'ACCESS',
  REFRESH: 'REFRESH'
};

const TOKEN_EXPIRE = {
  [TOKEN_TYPE.ACCESS]: process.env.ACCESS_TOKEN_EXPIRE || config.ACCESS_TOKEN_EXPIRE,
  [TOKEN_TYPE.REFRESH]: process.env.REFRESH_TOKEN_EXPIRE || config.REFRESH_TOKEN_EXPIRE
};

const SECRET_KEY = {
  [TOKEN_TYPE.ACCESS]: process.env.ACCESS_SECRET_KEY || config.ACCESS_SECRET_KEY,
  [TOKEN_TYPE.REFRESH]: process.env.REFRESH_SECRET_KEY || config.REFRESH_SECRET_KEY
};

/*
  If you want to handle error
  check err.JsonWebTokenError
*/

/*
  @TODO
  for better security, you need to encrypt payload(claims in jwt)
 */
class AuthToken {

  constructor() {}

  static encode(tokenType, payload) {
    return new Promise((resolve, reject) => {
      const secretKey = SECRET_KEY[tokenType];
      const options = {expiresIn: TOKEN_EXPIRE[tokenType]};

      payload.tokenType = tokenType;

      jwt.sign(payload, secretKey, options, (err, token) => {
        if (err) {
          return reject(err);
        }
        return resolve(token);
      });
    });
  }

  static decode(type, token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY[type], (err, payload) => {
        if (err) {
          return reject(err);
        }
        return resolve(payload);
      });
    });
  }

  static authenticate(req, res, next) {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return next();
    }
    const jwtToken = bearerToken.split(' ')[1];
    return AuthToken.decode(TOKEN_TYPE.ACCESS, jwtToken)
      .then(payload => {
        req.headers.userKey = payload.userKey;
        req.headers.permission = USER_PERMISSION[payload.userType];
        next();
      })
      .catch(err => {
        next(new APIError(err, {
          statusCode: 400,
          message: err.message
        }));
      });
  }
}

export default AuthToken;
