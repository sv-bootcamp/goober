import {KeyUtils, ENTITY, STATE} from './../key-utils';
import bcrypt from './../bcrypt';
import db, {fetchPrefix} from '../database';

export const USER_TYPE = {
  ANONYMOUS: 0,
  FACEBOOK: 1
};

const UserManager = {
  addUser: (key, value) => {
    return new Promise((resolve, reject) => {
      db.put(key, value, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(key);
      });
    });
  },
  getUser: (key) => {
    return new Promise((resolve, reject) => {
      db.get(key, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  },
  addAnonymousUser: (data) => {
    const userKey = UserModel.genUserKey();
    const userValue = {
      type: USER_TYPE.ANONYMOUS,
      name: 'guest',
      key: userKey
    };
    return bcrypt.hash(data.secret)
      .then(hash => {
        userValue.secret = hash;
        return UserModel.addUser(userKey, userValue);
      });
  },
  addFacebookUser: (data) => {
    const userKey = UserModel.genUserKey();
    const userValue = {
      type: USER_TYPE.FACEBOOK,
      key: userKey,
      facebookToken: data.facebookToken
    };

    // @TODO get facebook info using facebook graphAPI and save it.

    return UserModel.addUser(userKey, userValue);
  },
  genUserKey: () => {
    const timeHash = KeyUtils.genTimeHash();
    return `user-${timeHash}`;
  },
  modifyUser: (key, value, cb) => {
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
  },
  isPostType: (postType) => {
    if (postType === ENTITY.CREATED_POST
      || postType === ENTITY.SAVED_POST
      || postType === ENTITY.REACT_POST) {
      return true;
    }
    return false;
  },
  getPostKeys: (postType, userKey, cb) => {
    const prefix = `${postType}-${STATE.ALIVE}-${userKey}`;
    fetchPrefix(prefix, (err, keyData) => {
      cb(err, keyData);
    });
  }
};
export default UserManager;

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
}
