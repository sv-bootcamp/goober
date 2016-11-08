import db, {fetchPrefix} from '../database';
import {KeyUtils, ENTITY, STATE} from '../../server/key-utils';
import ImageManager from '../../server/images/models';

export default class UserManager {
  static modifyUser(key, value, cb) {
    return new Promise((resolve, reject) => {
      db.get(key, (err) => {
        return (err) ? reject(err) : resolve();
      });
    }).then(()=>{
      return new Promise((resolve, reject) => {
        db.put(key, value, (err) => {
          return (err) ? reject(err) : resolve();
        });
      });
    }).then(()=>{
      return cb(null);
    }).catch((err)=>{
      if (err.NotFound) {
        return new Error('Not found : invalid key');
      }
      return new Error(err);
    });
  }
  static isPostType(postType) {
    if (postType === ENTITY.CREATED_POST
     || postType === ENTITY.SAVED_POST
     || postType === ENTITY.REACT_POST) {
      return true;
    }
    return false;
  }
  static getPostKeys(postType, userKey, cb) {
    const prefix = `${postType}-${STATE.ALIVE}-${userKey}`;
    fetchPrefix(prefix, (err, keyData) => {
      cb(err, keyData);
    });
  }
}
export class CreatedPostManager {
  static addCreatedPost(entity, entityKey, userKey, timeHash, cb) {
    if (entity !== ENTITY.ITEM && entity !== ENTITY.IMAGE) {
      return cb(new Error(('invalid entity'), null));
    }
    const idxKey = KeyUtils.getIdxKey(ENTITY.CREATED_POST, timeHash, userKey);
    const idxPost = {
      entity,
      key: entityKey
    };
    return db.put(idxKey, idxPost, (err) => {
      if (err) {
        return cb(new Error('error while putting in DB'), null);
      }
      return cb(null, idxKey);
    });
  }
}
export class SavedPostManager {
  static addSavedPost(entityKey, userKey, timeHash, cb) {
    const idxKey = KeyUtils.getIdxKey(ENTITY.SAVED_POST, timeHash, userKey);
    const idxPost = {
      key: entityKey
    };
    return db.put(idxKey, idxPost, (err) => {
      if (err) {
        return cb(new Error('error while putting in DB'), null);
      }
      return cb(null, idxKey);
    });
  }
  static getSavedPosts(userKey, cb) {
    const imagePromises = [];
    const items = [];
    new Promise((resolve, reject) => {
      UserManager.getPostKeys(ENTITY.SAVED_POST, userKey, (err, posts) => {
        return (err) ? reject(err) : resolve(posts);
      });
    }).then((posts)=>{
      posts.map((post)=>{
        imagePromises.push(new Promise((resolve, reject) => {
          db.get(post.key, (err, item) => {
            return (err) ? reject(err) : resolve(item);
          });
        }).then((item)=>{
          return new Promise((resolve, reject) => {
            ImageManager.getImageUrls({itemKey: item.key, isThumbnail: true}, (err, imageUrls) => {
              if (err) {
                reject(err);
                return;
              }
              item.imageUrls = imageUrls;
              items.push(item);
              resolve();
            });
          });
        }).catch((err) => {
          return err;
        }));
      });
      Promise.all(imagePromises).then(() => {
        cb(null, items);
      }).catch((err) => {
        return err;
      });
    }).catch((err)=>{
      return cb(err);
    });
  }
}
