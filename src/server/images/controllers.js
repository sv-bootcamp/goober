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
        const conn = new S3Connector();
        conn.getImageUrls(keys, (err, urls) => {
          if (err) {
            return cb(new APIError(err));
          }
          res.status(200).send({
            imageUrls: urls
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
      const conn = new S3Connector();
      conn.getImageUrls([imageid], (err, urls) => {
        if (err) {
          return cb(new APIError(err));
        }
        res.status(200).send({
          imageUrl: urls[0]
        });
        return cb();
      });
    }
  }
};
