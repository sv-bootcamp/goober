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
  static addPost(postType, entity, post, timeHash, cb) {
    if (!this.isPostType(postType)) {
      return cb(new Error(('invalid post type.')), null);
    }
    if (!post.key || !post.userKey) {
      return cb(new Error(('key and userKey are undefined)'), null));
    }
    if (entity !== ENTITY.ITEM && entity !== ENTITY.IMAGE) {
      return cb(new Error(('invalid entity'), null));
    }
    const idxKey = KeyUtils.getIdxKey(postType, timeHash, post.userKey);
    const idxPost = {
      entity: entity,
      key: post.key
    };
    console.log(idxKey);
    console.log(idxPost);
    return db.put(idxKey, idxPost, (err) => {
      if (err) {
        return cb(new Error('error while putting in DB'), null);
      }
      return cb(null, idxKey);
    });
  }
}
