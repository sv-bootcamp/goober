import {KeyUtils, ENTITY, STATE} from '../key-utils';
import bcrypt from '../bcrypt';
import db, {fetchPrefix, putPromise, getPromise} from '../database';
import FacebookManager from './facebook-manager';

export const USER_TYPE = {
  ANONYMOUS: 'anonymous',
  FACEBOOK: 'facebook'
};


const ANONYMOUS_USER_DEFAULT = {
  NAME: 'guest'
};

const UserManager = {
  getUserKey: key => {
    return getPromise(key)
      .then(userData => {
        return userData.key;
      })
  }
  ,
  addAnonymousUser: (data) => {
    /*
      data : {
        secret(required) : "user secret",
        name(optional) : "user name. If it's undefined name set as default name"
      }
     */
    const userKey = UserManager.genUserKey();
    const userValue = {
      type: USER_TYPE.ANONYMOUS,
      name: data.name || ANONYMOUS_USER_DEFAULT.NAME,
      key: userKey
    };
    return bcrypt.hash(data.secret)
      .then(hash => {
        userValue.secret = hash;
        return putPromise(userKey, userValue);
      })
      .then(key => {
        const userIdx = UserManager.getUserIndexKey({
          userType: USER_TYPE.ANONYMOUS,
          secret: data.secret
        });
        return putPromise(userIdx, {key});
      });
  },
  addFacebookUser: (data) => {
    /*
      data : {

      }
     */
    const userKey = UserManager.genUserKey();
    const userValue = {
      type: USER_TYPE.FACEBOOK,
      key: userKey
    };
    let facebookId;
    return FacebookManager.getProfile(data.facebookToken)
      .then(profile => {
        userValue.name = profile.name;
        userValue.email = profile.email;
        userValue.facebookId = profile.id;
        facebookId = profile.id;
        return profile.id;
      })
      .then(FacebookManager.getProfileImage)
      .then(profileImg => {
        userValue.profileImgUrl = profileImg.data.url;
        return putPromise(userKey, userValue);
      })
      .then(key => {
        const userIdx = UserManager.getUserIndexKey({
          userType: USER_TYPE.FACEBOOK,
          facebookId: facebookId
        });
        return putPromise(userIdx, {key});
      });
  },
  genUserKey: () => {
    const timeHash = KeyUtils.genTimeHash();
    return `user-${timeHash}`;
  },
  getUserIndexKey: (params) => {
    switch (params.userType) {
    case USER_TYPE.ANONYMOUS:
      return `${ENTITY.USER}-${params.state || STATE.ALIVE}-${ENTITY.ANONYMOUS}-${params.secret}`;
    case USER_TYPE.FACEBOOK:
      return `${ENTITY.USER}-${params.state || STATE.ALIVE}` +
        `-${ENTITY.FACEBOOK}-${params.facebookId}`;
    default:
      return null;
    }
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
