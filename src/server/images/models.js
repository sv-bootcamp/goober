import db, {fetchPrefix} from '../database';
import {ENTITY, STATE, KeyUtils} from '../key-utils';
import {S3Connector, IMAGE_SIZE_PREFIX} from '../aws-s3';

export default class ImageManager {
  static fetchImage(keys = [], cb) {
    const promises = [];
    const values = [];
    for (const key of keys) {
      promises.push(new Promise((resolve, reject) => {
        db.get(key, (err, value) => {
          if (err) {
            reject();
            return;
          }
          value.key = key;
          values.push(value);
          resolve();
        });
      }));
    }
    Promise.all(promises).then(() => {
      cb(null, values);
    }).catch(() => {
      cb(new Error('database error'));
    });
  }
  static getImageUrls({itemKey, isThumbnail = false}, cb) {
    // get all image Urls of item
    const keys = [];
    const promises = [];
    const checkState = [STATE.ALIVE, STATE.EXPIRED];
    checkState.map((state) => {
      promises.push(new Promise((resolve, reject) => {
        const prefix = KeyUtils.getPrefix(ENTITY.IMAGE, state, itemKey);
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
    });
    Promise.all(promises)
    .then(() => {
      const s3Connector = new S3Connector();
      const urls = (isThumbnail) ?
        s3Connector.getPrefixedImageUrls(keys, IMAGE_SIZE_PREFIX.THUMBNAIL) :
        s3Connector.getImageUrls(keys);
      return cb(null, urls);
    })
    .catch((err) => {
      return cb(err);
    });
  }
}