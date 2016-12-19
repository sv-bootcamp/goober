import db, {getPromise} from '../database';
import {KeyUtils, STATE, CATEGORY, DEFAULT_PRECISON, ENTITY} from '../key-utils';
import UserManager from '../../server/users/models';
export const STATE_STRING = {
  [STATE.ALIVE]: 'alive',
  [STATE.EXPIRED]: 'expired',
  [STATE.REMOVED]: 'removed'
};
export default class ItemManager {
  static validChecker(item, cb) {
    if (item.category === CATEGORY.FACILITY || this.isValid(item.endTime)) {
      cb(true);
      return;
    }
    cb(false);
    ItemManager.changeState(item, STATE.EXPIRED);
  }
  static changeState(item, newState, cb = () => {}) {
    const timeHash = KeyUtils.parseTimeHash(item.key);
    item.state = STATE_STRING[newState];
    const ops = [
      {type: 'put', key: item.key, value: item}
    ];
    for (const state in STATE) {
      if (STATE.hasOwnProperty(state)) {
        const idxKeys = KeyUtils.getIdxKeys(item.lat, item.lng, timeHash, STATE[state]);
        for (let i = 0; i < DEFAULT_PRECISON; i = i + 1) {
          ops.push((STATE[state] === newState) ?
            {type: 'put', key: idxKeys[i], value: {key: item.key}} :
            {type: 'del', key: idxKeys[i]}
          );
        }
      }
    }
    db.batch(ops, (err) => {
      return (err) ? cb(err) : cb();
    });
  }
  static isValid(endTime) {
    // if endTime is '' or undefined or null, it is valid item. (no-time-limit)
    if (!endTime) {
      return true;
    }
    return (new Date().getTime() - new Date(endTime).getTime() < 0) ? true : false;
  }
  static fillIsSaved(userKey, items) {
    return UserManager.getPostKeys(ENTITY.SAVED_POST, userKey)
    .then((posts)=>{
      return new Promise((resolve)=>{
        items.sort((a, b) => {
          if (a.Key < b.key) return -1; // eslint-disable-line curly
          if (b.key < a.key) return 1; // eslint-disable-line curly
          return 0;
        });
        posts.sort((a, b) => {
          if (a.Key < b.key) return -1; // eslint-disable-line curly
          if (b.key < a.key) return 1; // eslint-disable-line curly
          return 0;
        });
        const itemKeys = this.getFields(items, 'key');
        const postKeys = this.getFields(posts, 'key');
        /*
          @TODO
          we can improve its performance more using
          binaryIndexOf or saving most close index below.
        */
        for (let i = 0, pointer = 0; i < itemKeys.length; i = i + 1) {
          const idx = postKeys.indexOf(itemKeys[i], pointer);
          if (idx !== -1) {
            items[i].isSaved = true;
            pointer = idx + 1;
          } else {
            items[i].isSaved = false;
          }
        }
        resolve(items);
      });
    });
  }
  static getFields(array, field) {
    return array.map((obj)=>{
      return obj[field];
    });
  }

  static removeItem(itemKey) {
    const timeHash = KeyUtils.parseTimeHash(itemKey);
    return getPromise(itemKey).then(value => {
      const opts = [];
      const indexingValue = {key: itemKey};
      const willBeAddedKeys =
        KeyUtils.getIdxKeys(value.lat, value.lng, timeHash, STATE.REMOVED);
      const willBeRemovedKeys =
        KeyUtils.getIdxKeys(value.lat, value.lng, timeHash, STATE.ALIVE)
          .concat(KeyUtils.getIdxKeys(value.lat, value.lng, timeHash, STATE.EXPIRED));

      willBeAddedKeys.map(key => {
        opts.push({type: 'put', key: key, value: indexingValue});
      });
      willBeRemovedKeys.map(key => {
        opts.push({type: 'del', key: key});
      });

      return new Promise((resolve, reject) => {
        db.batch(opts, (err) => {
          return err ? reject(err) : resolve();
        });
      });
    });
  }
}
