import db from '../server/database';
import {KeyUtils, ENTITY} from '../server/key-utils';

export default class PostManager {
  static addCreatedPost(entity, itemKey, userKey, timeHash, cb) {
    if (entity !== ENTITY.ITEM && entity !== ENTITY.IMAGE) {
      return cb(new Error(('invalid entity'), null));
    }
    const idxKey = KeyUtils.getIdxKey(ENTITY.CREATED_POST, timeHash, userKey);
    const idxPost = {
      entity: entity,
      key: itemKey
    };
    return db.put(idxKey, idxPost, (err) => {
      if (err) {
        return cb(new Error('error while putting in DB'), null);
      }
      return cb(null, idxKey);
    });
  }
  
  static addSavedPost(itmeKey, userKey, timeHash, cb) {
    const idxKey = KeyUtils.getIdxKey(ENTITY.SAVED_POST, timeHash, userKey);
    const idxPost = {
      key: itmeKey
    };
    return db.put(idxKey, idxPost, (err) => {
      if (err) {
        return cb(new Error('error while putting in DB'), null);
      }
      return cb(null, idxKey);
    });
  }
}
