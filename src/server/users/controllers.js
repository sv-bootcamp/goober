import {KeyUtils, ENTITY, STATE} from '../key-utils';
import {S3Connector} from '../aws-s3';
import db from '../database';
import AuthModel from '../auth/models';
import UserModel, {CreatedPostManager, SavedPostManager, USER_TYPE} from './models';
import uuid from 'uuid4';
import { APIError } from '../ErrorHandler';
export default {
  getById(req, res, next) {
    const userKey = req.params.id;
    return UserModel.getUserProfile(userKey)
      .then(profile => {
        res.status(200).send(profile);
        return next();
      })
      .catch(err => {
        return next(new APIError(err, {
          statusCode: err.statusCode,
          message: err.message
        }));
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
    const imageOpt = { key: imageKey, body: req.body.imageUrl };
    const dbOps = [
      { type: 'put', key: key, value: user },
      { type: 'put', key: idxKey, value: idxUser },
      { type: 'put', key: imageKey, value: image },
      { type: 'put', key: imageIdxKey, value: idxImage }
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
      res.status(200).send({ message: 'success', data: key });
      return cb();
    }).catch((err) => {
      return cb(new APIError(err, { statusCode: err.statusCode, message: err.message }));
    });
  },
  addSavedPost(req, res, cb) {
    const {userKey} = req.headers;
    const {itemKey} = req.body;
    SavedPostManager.addPost(userKey, itemKey).then((idxKey) => {
      res.status(200).send({
        message: 'success',
        data: idxKey
      });
      return cb();
    }).catch((err) => {
      return cb(new APIError(err));
    });
  },
  deleteSavedPost(req, res, cb) {
    const {itemKey} = req.body;
    const {userKey} = req.headers;
    return SavedPostManager.deletePost(userKey, itemKey)
    .then(()=>{
      res.status(200).send({
        message: 'success'
      });
      return cb();
    });
  },
  getSavedPosts(req, res, cb) {
    const {userKey} = req.headers;
    SavedPostManager.getPosts(userKey, (err, posts) => {
      if (err) {
        return cb(new APIError());
      }
      res.status(200).send(posts);
      return cb();
    });
  },
  getCreatedPosts(req, res, cb) {
    const {userKey} = req.headers;
    CreatedPostManager.getPosts(userKey, (err, posts) => {
      if (err) {
        return cb(new APIError());
      }
      res.status(200).send(posts);
      return cb();
    });
  },
  signup: (req, res, next) => {
    const {userType} = req.body;
    let addUser;
    switch (userType) {
    case USER_TYPE.ANONYMOUS:
      req.body.secret = uuid();
      addUser = UserModel.addAnonymousUser(req.body);
      break;
    case USER_TYPE.FACEBOOK:
      addUser = UserModel.addFacebookUser(req.body);
      break;
    default:
      return next(new APIError(new Error(), {
        statusCode: 400,
        message: 'invalid user type'
      }));
    }

    return addUser
      .then(userData => {
        const tokenPayload = {
          userType: userData.userType,
          userKey: userData.userKey
        };
        return AuthModel.encodeTokenSet(tokenPayload)
          .then(tokenSet => {
            tokenSet.userKey = userData.userKey;
            if (userData.userType === USER_TYPE.ANONYMOUS) {
              tokenSet.userSecret = userData.userSecret;
            }
            res.status(200).send(tokenSet);
            next();
          });
      })
      .catch((err) => {
        if (err.message === 'Already exists.') {
          return next(new APIError(err, {
            statusCode: 400,
            message: err.message
          }));
        }
        return next(new APIError(err, {
          statusCode: 500,
          message: err.message
        }));
      });
  }
};
