import {fetchPrefix, fetchKeys} from '../database';
import {ENTITY, STATE, KeyUtils} from '../key-utils';
import {S3Connector, IMAGE_SIZE_PREFIX} from '../aws-s3';

export default class ImageManager {
  // get all image Urls of item
  static getImageUrls({itemKey, isThumbnail = false}) {
    const checkState = [STATE.ALIVE, STATE.EXPIRED];
    return Promise.all(checkState.map(state => {
      return new Promise((resolve, reject) => {
        const prefix = KeyUtils.getPrefix(ENTITY.IMAGE, state, itemKey);
        fetchPrefix(prefix, (err, data) => err ?
          reject(err) : resolve(data.map(value => value.key)));
      });
    })).then(arrs => arrs.reduce((result, key) => result.concat(key)))
    .then(keys => {
      const s3Connector = new S3Connector();
      const urls = (isThumbnail) ?
        s3Connector.getPrefixedImageUrls(keys, IMAGE_SIZE_PREFIX.THUMBNAIL) :
        s3Connector.getImageUrls(keys);
      return urls;
    });
  }

 /**
  * @countImageOfItem
  * @param {string} itemKey - The key of target item.
  * @param {Array} [stateList=[]] - The list of state which is checked.
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

 /**
  * @getImageObjList
  * make simple image object list containing image key and url.
  * @param {Array} imageKeys imageKeys
  * @return {Array} objs
  * @example
  * const imageKeys = ['image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190b000'];
  * ImageManager.getImageObjList(imageKeys);
  * // →[
  * //   { imageKey: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190b000',
  * //     imageUrl: 'url-of-image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190b000'
  * //   }
  * //  ]
  */
  static getImageObjList(imageKeys) {
    const s3 = new S3Connector();
    return imageKeys.map((imageKey)=> ({imageKey, imageUrl: s3.getImageUrl(imageKey)}));
  }

 /**
  * @getImageKeys
  * get sorted image keys using item key.
  * @param {string} itemKey imageKey
  * @param {Array} [checkState=[STATE.ALIVE, STATE.EXPIRED]] checkState
  * @return {Array} image keys
  */
  static getImageKeys(itemKey, checkState = [STATE.ALIVE, STATE.EXPIRED]) {
    return Promise.all(checkState.map(state => {
      return new Promise((resolve, reject) => {
        const prefix = KeyUtils.getPrefix(ENTITY.IMAGE, state, itemKey);
        return fetchPrefix(prefix, (err, data) =>
          err ? reject(err) : resolve(data.map(value => value.key)));
      });
    })).then(keyList => keyList.reduce((result, key) => result.concat(key)))
    .then(keys => {
      return keys.sort((a, b) => {
        if (a.Key < b.key) return -1; // eslint-disable-line curly
        if (b.key < a.key) return 1; // eslint-disable-line curly
        return 0;
      });
    });
  }
}
