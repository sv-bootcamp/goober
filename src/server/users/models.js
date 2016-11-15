import {KeyUtils, ENTITY, STATE} from '../key-utils';
import bcrypt from '../bcrypt';
import db, {fetchPrefix, putPromise, getPromise} from '../database';
import FacebookManager from './facebook-manager';
import {PERMISSION} from '../permission';

export const USER_TYPE = {
  ANONYMOUS: 'anonymous',
  FACEBOOK: 'facebook'
};

export const USER_PERMISSION = {
  [USER_TYPE.ANONYMOUS]: PERMISSION.R,
  [USER_TYPE.FACEBOOK]: PERMISSION.RW
};


const ANONYMOUS_USER_DEFAULT = {
  NAME: 'guest'
};

const UserManager = {
  getUserKey: key => {
    return getPromise(key)
      .then(userData => {
        return userData.key;
      });
  },
  getUserProfile: userKey => {
    return getPromise(userKey)
      .then(userData => {
        return {
          key: userData.key,
          name: userData.name,
          email: userData.email,
          profileImgUrl: userData.profileImgUrl
        };
      });
  },
  addAnonymousUser: ({secret, name = ANONYMOUS_USER_DEFAULT.NAME}) => {
    const userKey = UserManager.genUserKey();
    const userValue = {
      type: USER_TYPE.ANONYMOUS,
      name,
      key: userKey
    };
    return bcrypt.hash(secret)
      .then(hash => {
        userValue.hash = hash;
        return putPromise(userKey, userValue);
      })
      .then(() => {
        return {
          userKey: userValue.key,
          userType: USER_TYPE.ANONYMOUS,
          userSecret: secret
        };
      });
  },
  addFacebookUser: ({facebookToken}) => {
    const userKey = UserManager.genUserKey();
    const userValue = {
      type: USER_TYPE.FACEBOOK,
      key: userKey
    };
    let facebookId;
    return FacebookManager.getProfile(facebookToken)
      .then(profile => {
        userValue.name = profile.name;
        userValue.email = profile.email;
        userValue.facebookId = profile.id;
        facebookId = profile.id;
        return profile.id;
      })
      .then(FacebookManager.getProfileImage)
      .then(profileImgUrl => {
        userValue.profileImgUrl = profileImgUrl;
        return putPromise(userKey, userValue);
      })
      .then(key => {
        const userIdx = UserManager.getUserIndexKey({
          userType: USER_TYPE.FACEBOOK,
          facebookId: facebookId
        });
        return putPromise(userIdx, {key});
      })
      .then(() => {
        return {
          userKey: userKey,
          userType: USER_TYPE.FACEBOOK
        };
      });
  },
  genUserKey: () => {
    const timeHash = KeyUtils.genTimeHash();
    return `user-${timeHash}`;
  },
  getUserIndexKey: ({userType, state, userId, facebookId}) => {
    switch (userType) {
    case USER_TYPE.ANONYMOUS:
      return `${ENTITY.USER}-${state || STATE.ALIVE}-${ENTITY.ANONYMOUS}-${userId}`;
    case USER_TYPE.FACEBOOK:
      return `${ENTITY.USER}-${state || STATE.ALIVE}` +
        `-${ENTITY.FACEBOOK}-${facebookId}`;
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
