import db, {fetchPrefix} from '../database';
import {ENTITY, STATE, KeyUtils} from '../key-utils';
import {S3Connector} from '../aws-s3';

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
  static getImages(itemKey, cb) {
    // get all images of item
    const keys = [];
    const promises = [];
    const checkState = [STATE.ALIVE, STATE.EXPIRED];
    for (const state of checkState) {
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
    }
    Promise.all(promises)
    .then(() => {
      const urls = new S3Connector().getImageUrls(keys);
      ImageManager.fetchImage(keys, (err, values) => {
        if (err) {
          return cb(err);
        }
        for (const url of urls) {
          for (const value of values) {
            if (url.indexOf(value.key) !== -1) {
              value.url = url;
              break;
            }
          }
        }
        return cb(null, values);
      });
    })
    .catch((err) => {
      return cb(err);
    });
  }
}
