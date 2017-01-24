import {KeyUtils, ENTITY, STATE} from '../key-utils';
import bcrypt from '../bcrypt';
import db, {fetchPrefix, putPromise, getPromise} from '../database';
import FacebookManager, {FacebookModel} from './facebook-manager';
import {PERMISSION} from '../permission';
import {STATE_STRING} from '../../server/items/models';
import ImageManager from '../../server/images/models';
import assert from 'assert';
import {ERRNO} from '../ErrorHandler';

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
  fetchUserProfiles: (values = []) => {
    return Promise.all(values.map(value => {
      return UserManager.getUserProfile(value.userKey).then(userValue => {
        value.user = userValue;
        return value;
      });
    }));
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
      .then(isExist => {
        if (isExist) {
          const err = new Error('Already exists');
          err.errno = ERRNO.USER_EXIST;
          throw err;
        }
        return FacebookManager.getProfileImage(userValue.facebookId);
      })
      .then(profileImgUrl => {
        userValue.profileImgUrl = profileImgUrl;

        assert(userValue.name, 'Invalid proerty - name');
        assert(userValue.facebookId, 'Invalid proerty - facebook id');
        assert(userValue.profileImgUrl, 'Invalid proerty - profile image url');
        userValue.email = userValue.email || 'N/A';

        return putPromise(userKey, userValue);
      })
      .then(() => {
        const userIdx = FacebookModel.getIdxKey(userValue.facebookId);
        return putPromise(userIdx, {key: userKey});
      })
      .then(() => ({ userKey, userType: USER_TYPE.FACEBOOK}))
      .catch(err => {
        if (err.errno === ERRNO.USER_EXIST) {
          return { userKey, userType: USER_TYPE.FACEBOOK };
        }
        throw err;
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
      // TODO : check out error
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
   * @fetchPost
   * make Item Json value includes entity and image Url about CreatedPost
   * @param {Object} post post object.
   * @return {object} Promise object returning fetched post object:
   * @example
   * const post =
   *  {  isCreatedByUser: false,
   *     itemKey: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
   *     imageKeys: ['image-8523569761934-dd3860f5-b82e-473b-1234-ead0f190b000']
   *  };
   *  console.log(CreatedPostManager.fetchPost(post));
   * // print →
   * //  {title: 'Pingo release party',
   * //   lat: 37.756787937,
   * //   lng: -122.4233365122,
   * //   address: '310 Dolores St, San Francisco, CA 94110, USA',
   * //   createdDate: '2016-12-20T01:11:46.851Z',
   * //   modifiedDate: '2016-12-21T01:11:46.851Z',
   * //   category: 'event',
   * //   startTime: '2016-12-24T01:11:46.851Z',
   * //   endTime: '2016-12-25T07:51:12.729Z',
   * //   state: 'alive',
   * //   key: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
   * //   userKey: 'user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid',
   * //   isCreatedByUser: false,
   * //   images: [
   * //             {
   * //               imageKey: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190b000',
   * //               imageUrl: 'url-of-image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190b000'
   * //             }
   * //           ]
   * //  }
  **/
  static fetchPost({isCreatedByUser, itemKey, imageKeys}) {
    return getPromise(itemKey).then((item)=>{
      item.isCreatedByUser = isCreatedByUser;
      item.images = ImageManager.getImageObjList(imageKeys);
      return item;
    });
  }
/**
 * @combinePosts
 * combine key sets for unique item key
 * @param {Array} posts objects array
 * @return {Array} combined post objects array
 * @example
 * const posts = [
 *  {  entity  : 'image',
 *     itemKey : 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
 *     imageKey: 'image-8523569761934-dd3860f5-b82e-473b-1234-ead0f190b000'
 *  },
 *  {  entity  : 'item',
 *     itemKey : 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
 *     imageKey: 'image-8523569761934-dd3860f5-b82e-473b-1234-ead0f190b999'
 *  }
 * ];
 * console.log(CreatedPostManager.fetchPost(post));
 * // print →
 * //   { isCreatedByUser : true,
 * //      itemKey : 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
 * //      imageKeys :
 * //      [ 'image-8523569761934-dd3860f5-b82e-473b-1234-ead0f190b000',
 * //        'image-8523569761934-dd3860f5-b82e-473b-1234-ead0f190b999'
 * //      ]
 * //   }
 */
  static combinePosts(posts) {
    const objMap = new Map();
    posts.map((post)=> {
      if (!objMap.get(post.itemKey)) {
        // if there's no value of itemKey, init an object.
        objMap.set(post.itemKey, {
          isCreatedByUser: 'false',
          itemKey: post.itemKey,
          imageKeys: []
        });
      }
      // if this item is created by this user -> isCreatedByUser = true
      objMap.get(post.itemKey).isCreatedByUser =
        (post.entity === ENTITY.ITEM) || objMap.get(post.itemKey).isCreatedByUser;
      objMap.get(post.itemKey).imageKeys.push(post.imageKey);
    });
    // convert map to array for return
    return Array.from(objMap.values());
  }
  static getPosts(userKey, cb) {
    const res = [];
    UserManager.getPostKeys(ENTITY.CREATED_POST, userKey)
    .then((posts) => {
      const combinedPosts = CreatedPostManager.combinePosts(posts);
      return Promise.all(combinedPosts.map((post)=>{
        return CreatedPostManager.fetchPost(post).then((fetchedPost)=>{
          if (fetchedPost.state !== STATE.REMOVED) {
            res.push(fetchedPost);
          }
        });
      }));
    }).then(()=>{
      cb(null, res);
    })
    .catch((err)=>{
      cb(err);
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
    const value = {key: entityKey, createdTime: Number(new Date())};
    return putPromise(key, value);
  }
  static getPosts(userKey, cb) {
    const targetStates = [
      STATE_STRING[STATE.ALIVE],
      STATE_STRING[STATE.EXPIRED]
    ];
    return UserManager.getPostKeys(ENTITY.SAVED_POST, userKey)
    .then(posts => {
      // Descending sort saved posts using createdTime field.
      posts.sort((a, b) => {
        if (a.createdTime > b.createdTime) return -1; // eslint-disable-line curly
        if (b.createdTime > a.createdTime) return 1; // eslint-disable-line curly
        return 0;
      });
      return Promise.all(
        posts.map(post => getPromise(post.key).then(item => new Promise(resolve => {
          if (targetStates.indexOf(item.state) === -1) {
            return resolve();
          }
          return ImageManager.getImageUrls({itemKey: item.key, isThumbnail: true}).then(urls => {
            item.imageUrls = urls;
            return resolve(item);
          });
        })))
      ).then(items => cb(null, items.filter(item => item)));
    }).catch(cb);
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
