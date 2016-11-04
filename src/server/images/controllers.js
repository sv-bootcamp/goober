import db, {fetchPrefix} from '../database';
import {KeyUtils} from '../key-utils';
import {S3Connector} from '../aws-s3';
import {APIError} from '../ErrorHandler';
import {ENTITY, STATE} from '../constants';
import ImageManager from './models';

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
    }
  },
  post(req, res, cb) {
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
          userKey: req.body.userKey,
          caption: req.body.caption,
          createdDate: currentTime.toISOString()
        };
        const idxImage = {key};
        const ops = [
          {type: 'put', key, value: image},
          {type: 'put', key: idxKey, value: idxImage}
        ];
        db.batch(ops, (err) => {
          return (err) ? reject(err) : resolve();
        });
      });
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
