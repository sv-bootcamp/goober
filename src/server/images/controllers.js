import db from '../database';
import {ENTITY, STATE, KeyUtils} from '../key-utils';
import {S3Connector} from '../aws-s3';
import {APIError} from '../ErrorHandler';
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
          ImageManager.fetchPrefix(prefix, (err, data) => {
            if (err) {
              reject(err);
              return;
            }
            data.map((key) => {
              keys.push(key);
            });
            resolve();
          });
        }));
      }
      Promise.all(promises).then(() => {
        return new Promise((resolve, reject) => {
          const conn = new S3Connector();
          conn.getImageUrls(keys, (err, urls) => {
            if (err) {
              reject();
              return;
            }
            resolve(urls);
          });
        });
      }).then((urls)=>{
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
        const conn = new S3Connector();
        conn.getImageUrl(image, (err, url) => {
          if (err) {
            return cb(new APIError(err));
          }
          value.url = url;
          res.status(200).send(value);
          return cb();
        });
      });
    }
  },
  post(req, res, cb) {
    const currentTime = new Date();
    const timeHash = KeyUtils.genTimeHash(currentTime);
    const key = `${ENTITY.IMAGE}-${timeHash}`;
    const idxKey = KeyUtils.getIdxKey(ENTITY.IMAGE, timeHash, req.body.itemKey);
    const s3 = new S3Connector();

    const opt = {key: key, body: req.body.image};
    new Promise((resolve, reject) => {
      s3.putImage(opt, (err) => {
        return (err) ? reject(err) : resolve();
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        s3.getImageUrl(key, (err, url)=>{
          return (err) ? reject(err) : resolve(url);
        });
      });
    })
    .then((url) => {
      return new Promise((resolve, reject) => {
        const image = {
          key: key,
          url: url,
          userKey: req.body.userKey,
          caption: req.body.caption,
          createdDate: currentTime.toISOString()
        };
        const idxImage = {key: key};
        const ops = [
          {type: 'put', key: key, value: image},
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
