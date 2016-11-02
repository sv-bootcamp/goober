import jwt from 'jsonwebtoken';
import config from 'config';

export const TOKEN_TYPE = {
  ACCESS: 'ACCESS',
  REFRESH: 'REFRESH'
};

const TOKEN_EXPIRE = {
  ACCESS: process.env.ACCESS_TOKEN_EXPIRE || config.ACCESS_TOKEN_EXPIRE,
  REFRESH: process.env.REFRESH_TOKEN_EXPIRE || config.REFRESH_TOKEN_EXPIRE
};

const SECRET_KEY = {
  ACCESS:  process.env.ACCESS_SECRET_KEY || config.ACCESS_SECRET_KEY,
  REFRESH: process.env.REFRESH_SECRET_KEY || config.REFRESH_SECRET_KEY
};

/*
  @TODO
  for better security, you need to encrypt payload(claims in jwt)
 */
class AuthToken {

  constructor() {}

  encode(type, payload) {
    return new Promise((resolve) => {
      jwt.sign(payload, SECRET_KEY[type], { expiresIn: TOKEN_EXPIRE[type]}, (err, token) => {
        if (err) {
          throw err;
        }
        return resolve(token);
      });
    });
  }

  decode(type, token) {
    return new Promise((resolve) => {
      jwt.verify(token, SECRET_KEY[type], (err, payload) => {
        if (err) {
          throw err;
        }
        return resolve(payload);
      })
    });
  }

}

export default AuthToken = new AuthToken();
