import jwt from 'jsonwebtoken';
import config from 'config';
import {APIError} from './ErrorHandler';

export const TOKEN_TYPE = {
  ACCESS: 'ACCESS',
  REFRESH: 'REFRESH'
};

// const TOKEN_EXPIRE = {
//   [TOKEN_TYPE.ACCESS]: process.env.ACCESS_TOKEN_EXPIRE || config.ACCESS_TOKEN_EXPIRE,
//   [TOKEN_TYPE.REFRESH]: process.env.REFRESH_TOKEN_EXPIRE || config.REFRESH_TOKEN_EXPIRE
// };

const SECRET_KEY = {
  [TOKEN_TYPE.ACCESS]: process.env.ACCESS_SECRET_KEY || config.ACCESS_SECRET_KEY,
  [TOKEN_TYPE.REFRESH]: process.env.REFRESH_SECRET_KEY || config.REFRESH_SECRET_KEY
};

/*
  @TODO
  for better security, you need to encrypt payload(claims in jwt)
 */
class AuthToken {

  constructor() {}

  encode(type, payload) {
    return new Promise((resolve, reject) => {
      payload.type = type;
      jwt.sign(payload, SECRET_KEY[type], {expiresIn: '2 days'}, (err, token) => {
        if (err) {
          return reject(err);
        }
        return resolve(token);
      });
    });
  }

  decode(type, token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY[type], (err, payload) => {
        if (err) {
          return reject(err);
        }
        return resolve(payload);
      });
    });
  }

  authenticate(req, res, next) {
    const bearerToken = req.headers.authorization;
    const jwtToken = bearerToken.split(' ')[1];
    this.decode(TOKEN_TYPE.ACCESS, jwtToken)
    .then(payload => {
      req.headers.userKey = payload.user;
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

export default AuthToken = new AuthToken();
