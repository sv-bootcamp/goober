import {KeyUtils, ENTITY, STATE} from '../key-utils';
import {S3Connector} from '../aws-s3';
import db from './../database';
import {APIError} from './../ErrorHandler';
import jwt, {TOKEN_TYPE} from './../auth-token';
import UserModel from './models';
export default {
  get(req, res, cb) {
    const key = req.params.id;
    db.get(key, (err, data) => {
      if (err) {
        if (err.notFound) {
          return cb(new APIError(err, {
            statusCode: 400,
            message: 'User was not found'
          }));
        }
        return cb(new APIError(err));
      }
      delete data.password;
      delete data.accountType;
      res.status(200).send(data);
      return cb();
    });
  },
  post(req, res, cb) {
    const currentTime = new Date();
    const timeHash = KeyUtils.genTimeHash(currentTime);
    const key = `${ENTITY.USER}-${timeHash}`;
    const idxKey = KeyUtils.getPrefix(ENTITY.USER, STATE.ALIVE, timeHash);
    const user = {
      key: key,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      imageUrl: req.body.image
    };
    const idxUser = {
      key: key
    };
    const imageKey = `${ENTITY.IMAGE}-${timeHash}`;
    const imageIdxKey = KeyUtils.getIdxKey(ENTITY.IMAGE, timeHash, key);
    const image = {
      key: imageKey,
      userKey: key,
      createdDate: currentTime.toISOString()
    };
    const idxImage = {
      key: imageKey
    };
    const imageOpt = {key: imageKey, body: req.body.imageUrl};
    const dbOps = [
      {type: 'put', key: key, value: user},
      {type: 'put', key: idxKey, value: idxUser},
      {type: 'put', key: imageKey, value: image},
      {type: 'put', key: imageIdxKey, value: idxImage}
    ];
    new Promise((resolve, reject) => {
      new S3Connector().putImage(imageOpt, (err) => {
        return (err) ? reject(err) : resolve();
      });
    }).then(() => {
      return new Promise((resolve, reject) => {
        db.batch(dbOps, (err) => {
          return (err) ? reject(err) : resolve();
        });
      });
    }).then(() => {
      res.status(200).send({message: 'success', data: key });
      return cb();
    }).catch((err) => {
      return cb(new APIError(err, {statusCode: err.statusCode, message: err.message}));
    });
  },
  signup: (req, res, next) => {
    const {userType} = req.body;
    let addUser;

    switch (userType) {
      case 'anonymous':
        addUser = UserModel.addAnonymousUser(req.body);
        break;
      case 'facebook':
        addUser = UserModel.addFacebookUser(req.body);
        break;
      default:
        break;
    }

    addUser
      .then(UserModel.getTokenSet)
      .then((tokenSet)=>{
        res.send({
          accessToken: tokenSet[0],
          refreshToken: tokenSet[1]
        });
        next();
      })
      .catch((err) => {
        next(new APIError(err, {
          statusCode: 500,
          message: err.message
        }));
      });
  },
  refreshToken: (req , res, next) => {
    jwt.decode(req.body.refreshToken)
      .then((decoded) => {
        if (decoded.type === TOKEN_TYPE.REFRESH) {
          res.send(UserModel.getTokenSet(decoded.user));
          return next();
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
};
