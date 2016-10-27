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
  static getPost(postType, userKey, cb) {
    if (!this.isPostType(postType)) {
      return cb(new Error(('invalid post type.')));
    }
    const timeHash = KeyUtils.getTimeHash(userKey);
    const key = `${postType}-${timeHash}`;
    return db.get(key, (err, data) => {
      if (err) {
        if (err.notFound) {
          return cb(new Error('posts was not found'));
        }
        return cb(new Error(err));
      }
      return cb(null, data);
    });
  }
}
