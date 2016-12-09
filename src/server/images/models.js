import db, {fetchPrefix, fetchKeys} from '../database';
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
  // get all image Urls of item
  static getImageUrls({itemKey, isThumbnail = false}, cb) {
    const keys = [];
    const checkState = [STATE.ALIVE, STATE.EXPIRED];
    Promise.all(checkState.map((state) => {
      return new Promise((resolve, reject) => {
        const prefix = KeyUtils.getPrefix(ENTITY.IMAGE, state, itemKey);
        fetchPrefix(prefix, (err, data) => {
          if (err) {
            return reject(err);
          }
          data.map((value) => {
            keys.push(value.key);
          });
          return resolve();
        });
      });
    })).then(() => {
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

  /**
   *
   * @countImageOfItem
   *
   * @param {string} itemKey - The key of target item.
   * @param {string} stateList - The list of state which is checked.
   * @return {Number} number of images of an item
   */
  static countImageOfItem(itemKey, ...stateList) {
    const prefixes = stateList.map(state => {
      return KeyUtils.getPrefix(ENTITY.IMAGE, state, itemKey);
    });

    return Promise.all(prefixes.map((prefix) => {
      return new Promise((resolve, reject) => {
        fetchKeys(prefix, (err, keys) => {
          return err ? reject(err) : resolve(keys.length);
        });
      });
    })).then(lengthList => {
      return lengthList.reduce((sum, num) => {
        return sum + num;
      });
    });
  }
}
