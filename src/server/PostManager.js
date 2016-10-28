import db from '../server/database';
import {KeyUtils, ENTITY} from '../server/key-utils';

export default class PostManager {
  constructor() {

  }
  static isPostType(postType) {
    if (postType === ENTITY.CREATED_POST
     || postType === ENTITY.SAVED_POST
     || postType === ENTITY.REACT_POST) {
      return true;
    }
    return false;
  }
  static addPost(postType, item, timeHash, cb) {
    if (!this.isPostType(postType)) {
      return cb(new Error(('invalid post type.')), null);
    }
    if (!item.key || !item.userKey) {
      return cb(new Error(('key and userKey are undefined)')));
    }
    const idxKey = KeyUtils.getIdxKey(postType, timeHash, item.userKey);
    const idxPost = {
      key: item.key
    };
    return db.put(idxKey, idxPost, (err) => {
      if (err) {
        return cb(new Error('error while putting in DB'), null);
      }
      return cb(null, idxKey);
    });
  }
}
