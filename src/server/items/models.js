import db from '../database';
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
        posts.sort((a, b) => {
          return a.key > b.key;
        });
        const postKeys = this.getFields(posts, 'key');
        const itemKeys = this.getFields(items, 'key');
        let pointer = 0;
        for (let i = 0; i < postKeys.length; i = i + 1) {
          const idx = itemKeys.indexOf(postKeys[i], pointer);
          if (idx !== -1) {
            items[idx].isSaved = true;
            for (let j = pointer; j < idx; j = j + 1) {
              items[j].isSaved = false;
            }
            pointer = idx + 1;
          }
        }
        for (let j = pointer; j < items.length; j = j + 1) {
          items[j].isSaved = false;
        }
        resolve(items);
      });
    });
  }
  static getFields(array, field) {
    const ans = array.map((obj)=>{
      return obj[field];
    });
    return ans;
  }
}
