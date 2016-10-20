import db from '../database';
import {KeyUtils, STATE, DEFAULT_PRECISON} from '../key-utils';

export default class ItemManager {
  static validChecker(item, cb) {
    if (this.isValid(item.endTime)) {
      cb(true);
      return;
    }
    cb(false);
    ItemManager.changeState(item, STATE.EXPIRED);
  }
  static changeState(item, newState, cb = () => {}) {
    const timeHash = KeyUtils.getTimeHash(item.key);
    const ops = [];
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
    return (new Date().getTime() - new Date(endTime).getTime() < 0) ? true : false;
  }
}
