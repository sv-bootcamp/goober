import {ENTITY, STATE, KeyUtils} from '../key-utils';
import {S3Connector} from '../aws-s3';
import {APIError} from '../ErrorHandler';
import ImageManager from './models';

export default {
  get(req, res, cb) {
    const {itemid, imageid} = req.query;
    if (itemid) {
      // get all images of item
      const keys = [];
      const promises = [];
      const checkState = [STATE.ALIVE, STATE.EXPIRED];

      for (const state of checkState) {
        promises.push(new Promise((resolve, reject) => {
          const prefix = KeyUtils.getPrefix(ENTITY.IMAGE, state, itemid);
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
    } else if (imageid) {
      // get an images
      ImageManager.fetchImage([imageid], (errFetch, values) => {
        if (errFetch) {
          cb(new APIError(errFetch, {
            statusCode: 500,
            message: 'Internal Database Error'
          }));
          return;
        }
        const value = values[0];
        const conn = new S3Connector();
        conn.getImageUrl(imageid, (err, url) => {
          if (err) {
            return cb(new APIError(err));
          }
          value.url = url;
          res.status(200).send(value);
          return cb();
        });
      });
    }
  }
};
