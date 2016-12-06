import {KeyUtils, ENTITY, STATE} from '../key-utils';
import bcrypt from '../bcrypt';
import db, {fetchPrefix, putPromise, getPromise} from '../database';
import FacebookManager, {FacebookModel} from './facebook-manager';
import {PERMISSION} from '../permission';
import {STATE_STRING} from '../../server/items/models';
import ImageManager from '../../server/images/models';
import {S3Connector} from '../aws-s3';
import assert from 'assert';

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
    return FacebookManager.getProfile(facebookToken)
      .then(profile => {
        userValue.name = profile.name;
        userValue.email = profile.email;
        userValue.facebookId = profile.id;
        return profile.id;
      })
      .then(FacebookModel.isDuplicated)
      .then((isExist) => {
        if (isExist) {
          throw new Error('Already exists');
        }
        return FacebookManager.getProfileImage();
      })
      .then(profileImgUrl => {
        userValue.profileImgUrl = profileImgUrl;

        assert(userValue.name, 'Invalid proerty - name');
        assert(userValue.facebookId, 'Invalid proerty - facebook id');
        assert(userValue.profileImgUrl, 'Invalid proerty - profile image url');
        assert(userValue.email, 'Invalid proerty - profile image url');

        return putPromise(userKey, userValue);
      })
      .then(() => {
        const userIdx = FacebookModel.getIdxKey(userValue.facebookId);
        return putPromise(userIdx, {key: userKey});
      })
      .then(() => {
        return {
          userKey,
          userType: USER_TYPE.FACEBOOK
        };
      });
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
  getPostKeys: (postType, userKey) => {
    return new Promise((resolve, reject)=>{
      const prefix = `${postType}-${STATE.ALIVE}-${userKey}`;
      fetchPrefix(prefix, (err, keySets) => {
        return (err) ? reject(err) : resolve(keySets);
      });
    });
  }
};
export default UserManager;
export class CreatedPostManager {
  static addPost(userKey, {entity, itemKey, imageKey}, timeHash) {
    /*
    sample of parameter
    {
      entity  : 'image',
      itemKey : 'item-8523569761934-dd3860f5-..',
      imageKey: 'image-8523569761900-dcca60d3-'
    }
    */
    return new Promise((resolve, reject) => {
      const idxKey = KeyUtils.getIdxKey(ENTITY.CREATED_POST, timeHash, userKey);
      return db.put(idxKey, {entity, itemKey, imageKey}, (err) => {
        return (err) ? reject(err) : resolve(idxKey);
      });
    });
  }

/**
 * make Item Json value includes entity and image Url about CreatedPost
 * @param {Object} keySet example:
 * {  entity: 'image',
 *    itemKey: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
 *    imageKey: 'image-8523569761934-dd3860f5-b82e-473b-1234-ead0f190b000'
 * }
 * @param {function} cb callback function
 * @return {Object} item example:
 * {  title: 'Pingo release party',
 *    lat: 37.756787937,
 *    lng: -122.4233365122,
 *    address: '310 Dolores St, San Francisco, CA 94110, USA',
 *    createdDate: '2016-12-20T01:11:46.851Z',
 *    modifiedDate: '2016-12-21T01:11:46.851Z',
 *    category: 'event',
 *    startTime: '2016-12-24T01:11:46.851Z',
 *    endTime: '2016-12-25T07:51:12.729Z',
 *    state: 'alive',
 *    key: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
 *    userKey: 'user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid',
 *    entity: 'image',
 *    imageUrl: 'url-of-image-8523569761934-dd3860f5-b82e-473b-1234-ead0f190b000'
 * }
**/
  static getPost({entity, itemKey, imageKey}, cb) {
    db.get(itemKey, (err, item) => {
      if (err) {
        return cb(err);
      }
      item.entity = entity;
      item.imageUrl = new S3Connector().getImageUrl(imageKey);
      return cb(null, item);
    });
  }
  static getPosts(userKey, cb) {
    const posts = [];
    const promises = [];
    UserManager.getPostKeys(ENTITY.CREATED_POST, userKey)
    .then((keySets) => {
      keySets.map((keySet)=>{
        promises.push(new Promise((resolve, reject) => {
          CreatedPostManager.getPost(keySet, (err, item) => {
            if (err) {
              reject(err);
              return;
            }
            if (item.state !== STATE.REMOVED) {
              posts.push(item);
            }
            resolve();
          });
        }));
      });
      Promise.all(promises).then(() => {
        return cb(null, posts);
      }).catch((err) => {
        return err;
      });
    }).catch((err)=>{
      return cb(err);
    });
  }
  static genKey(userKey, entityKey, state) {
    const timeHash = KeyUtils.parseTimeHash(entityKey);
    return `${ENTITY.CREATED_POST}-${state}-${userKey}-${timeHash}`;
  }
  static deletePost(key) {
    const newKey = KeyUtils.replaceState(key, STATE.REMOVED);
    return getPromise(key)
    .then((value) => {
      const ops = [
        {type: 'del', key},
        {type: 'put', key: newKey, value}
      ];
      return ops;
    })
    .then((ops) => {
      return new Promise((resolve, reject) => {
        db.batch(ops, (err) => {
          return (err) ? reject(err) : resolve(newKey);
        });
      });
    });
  }
}
export class SavedPostManager {
  static addPost(userKey, entityKey) {
    const key = `${ENTITY.SAVED_POST}-${STATE.ALIVE}-${userKey}-${entityKey}`;
    const value = {key: entityKey};
    return putPromise(key, value);
  }
  static getPosts(userKey, cb) {
    const imagePromises = [];
    const items = [];
    const TARGET_STATE = [
      STATE_STRING[STATE.ALIVE],
      STATE_STRING[STATE.EXPIRED]
    ];
    UserManager.getPostKeys(ENTITY.SAVED_POST, userKey)
    .then((posts)=>{
      posts.map((post)=>{
        imagePromises.push(new Promise((resolve, reject) => {
          db.get(post.key, (err, item) => {
            return (err) ? reject(err) : resolve(item);
          });
        }).then((item)=>{
          items.push(item);
          return new Promise((resolve, reject) => {
            if (TARGET_STATE.indexOf(item.state) === -1) {
              resolve();
              return;
            }
            ImageManager.getImageUrls({itemKey: item.key, isThumbnail: true}, (err, imageUrls) => {
              if (err) {
                reject(err);
                return;
              }
              item.imageUrls = imageUrls;
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
  static deletePost(userKey, itemKey) {
    const idxKey = `${ENTITY.SAVED_POST}-${STATE.ALIVE}-${userKey}-${itemKey}`;
    return new Promise((resolve, reject) => {
      db.del(idxKey, (err) => {
        return (err) ? reject(err) : resolve();
      });
    });
  }
}
