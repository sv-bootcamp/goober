import db, {fetchPrefix} from '../database';
import {ENTITY, STATE, KeyUtils} from '../key-utils';
import {S3Connector} from '../aws-s3';
import {APIError} from '../ErrorHandler';
import ImageManager from './models';
import {CreatedPostManager} from '../users/models';
import assert from 'assert';

export default {
  get(req, res, cb) {
    const {item, image} = req.query;
    if (item) {
      // get all images of item
      const keys = [];
      const promises = [];
      const checkState = [STATE.ALIVE, STATE.EXPIRED];

      for (const state of checkState) {
        promises.push(new Promise((resolve, reject) => {
          const prefix = KeyUtils.getPrefix(ENTITY.IMAGE, state, item);
          fetchPrefix(prefix, (err, data) => {
            if (err) {
              reject(err);
              return;
            }
            data.map((value) => {
              keys.push(value.key);
            });
            resolve();
          });
        }));
      }
      Promise.all(promises).then(() => {
        const urls = new S3Connector().getImageUrls(keys);
        ImageManager.fetchImage(keys, (err, values) => {
          if (err) {
            return cb(new APIError(err, {
              statusCode: 500,
              message: 'Internal Database Error'
            }));
          }

          for (const url of urls) {
            for (const value of values) {
              if (url.indexOf(value.key) !== -1) {
                value.url = url;
                break;
              }
            }
          }
          res.status(200).send({
            values: values
          });
          return cb();
        });
      }).catch((err) => {
        return cb(new APIError(err, {
          statusCode: 500,
          message: 'Internal Database Error'
        }));
      });
      return;
    } else if (image) {
      // get an images
      ImageManager.fetchImage([image], (errFetch, values) => {
        if (errFetch) {
          cb(new APIError(errFetch, {
            statusCode: 500,
            message: 'Internal Database Error'
          }));
          return;
        }
        const value = values[0];
        value.url = new S3Connector().getImageUrl(image);
        res.status(200).send(value);
        cb();
        return;
      });
      return;
    }
    cb(new APIError(new Error(), {
      statusCode: 400,
      message: 'Bad Request : No query string'
    }));
  },
  post(req, res, cb) {
    assert(req.headers.userKey, 'userKey should be provided.');
    assert(req.body.itemKey, 'itemKey should be provided.');
    const currentTime = new Date();
    const timeHash = KeyUtils.genTimeHash(currentTime);
    const key = `${ENTITY.IMAGE}-${timeHash}`;
    const idxKey = KeyUtils.getIdxKey(ENTITY.IMAGE, timeHash, req.body.itemKey);
    const s3 = new S3Connector();

    const opt = {key, body: req.body.image};
    new Promise((resolve, reject) => {
      s3.putImage(opt, (err) => {
        return (err) ? reject(err) : resolve();
      });
    })
    .then(() => {
      const url = s3.getImageUrl(key);
      return new Promise((resolve, reject) => {
        const image = {
          key,
          url,
          userKey: req.headers.userKey,
          itemKey: req.body.itemKey,
          caption: req.body.caption,
          createdDate: currentTime.toISOString()
        };
        const idxImage = {key};
        const ops = [
          {type: 'put', key, value: image},
          {type: 'put', key: idxKey, value: idxImage}
        ];
        db.batch(ops, (err) => {
          return (err) ? reject(err) : resolve(image);
        });
      });
    })
    .then((image) => {
      const createdPost = {
        entity: ENTITY.IMAGE,
        itemKey: image.itemKey,
        imageKey: image.key
      };
      return CreatedPostManager.addPost(image.userKey, createdPost, timeHash);
    })
    .then(() => {
      res.status(200).send({message: 'success', data: key });
      return cb();
    })
    .catch((err) => {
      return cb(new APIError(err, {statusCode: err.statusCode, message: err.message}));
    });
  }
};
