import db from '../database';
import {KeyUtils, STATE, DEFAULT_PRECISON} from '../key-utils';

export default class ItemManager {
  static validChecker(item, cb) {
    let error;
    if (KeyUtils.isValid(item.endTime)) {
      return cb(error, true);
    }
    ItemManager.removeIdxItems(item, (err)=>{
      error = err;
    });
    return cb(error, false);
  }
  static removeIdxItems(item, cb) {
    const timeHash = KeyUtils.getTimeHash(item.key);
    const newIdxKeys = KeyUtils.getIdxKeys(item.lat, item.lng, timeHash, STATE.REMOVED);
    const ops = [];
    for (let i = 0; i < DEFAULT_PRECISON; i = i + 1) {
      ops.push({type: 'put', key: newIdxKeys[i], value: {key: item.key}});
    }
    for (const state in STATE) {
      if (STATE[state] !== STATE.REMOVED) {
        const idxKeys = KeyUtils.getIdxKeys(item.lat, item.lng, timeHash, STATE[state]);
        for (let i = 0; i < DEFAULT_PRECISON; i = i + 1) {
          ops.push({type: 'del', key: idxKeys[i]});
        }
      }
    }
    db.batch(ops, (err) => {
      return (err) ? cb(err) : cb();
    });
  }
}
