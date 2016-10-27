import jwt from 'jsonwebtoken';
import config from 'config';

const SECRET_KEY = process.env.JWT_SECRET_KEY || config.JWT_SECRET_KEY;
const TOKEN_EXPIRE = process.env.JWT_TOKEN_EXPIRE || config.JWT_TOKEN_EXPIRE;

/*
  @TODO
  for better security, you need to encrypt payload(claims in jwt)
 */
class AuthToken {

  constructor() {}

  encode(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRE}, (err, token) => {
          if (err) {
            return reject(err);
          }
        return resolve(token);
      });
    });
  }

  decode(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (err, payload) => {
        if (err) {
          return reject(err);
        }
        return resolve(payload);
      })
    });
  }
}

export default AuthToken = new AuthToken(SECRET_KEY);
