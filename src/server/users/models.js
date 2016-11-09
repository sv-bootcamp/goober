import {KeyUtils, ENTITY, STATE} from './../key-utils';
import bcrypt from './../bcrypt';
import db, {fetchPrefix} from '../database';
import request from 'request-promise';
import config from 'config';

const FACEBOOK_BASE_URL = 'https://graph.facebook.com';
const FACEBOOK_USER_PROFILE_URL = '/me';
const FACEBOOK_PROFILE_IMAGE_URL = '/picture';

export const FacebookManager = {
  getProfile: (accessToken) => {
    return request({
      uri: `${FACEBOOK_BASE_URL}${FACEBOOK_USER_PROFILE_URL}`,
      qs: {
        fields: 'name,email,verified',
        access_token: accessToken
      },
      json: true
    }).then((profile) => {
      console.log('profile');
      console.log(profile);
      return profile;
    });
  },
  getId: (accessToken) => {
    return FacebookManager.getProfile(accessToken)
      .then(profile => {

        const index = 'id';
        const temp = profile[index];
        console.log('one');
        console.log(profile);
        JSON.stringify(profile).split('"').map(data => console.log(data));
        console.log('second');
        console.log(profile);
        console.log('here');
        console.log(temp);
        console.log(typeof temp);
        console.log(JSON.stringify(profile));
        console.log(typeof profile);
        console.log(profile.id);
        console.log(typeof profile.id);
        console.log(profile.name);
        console.log(typeof profile.name);
        console.log(profile.verified);
        console.log('profile.id');
        return profile.id;
      });
  },
  getProfileImage: (id) => {
    return request({
      uri: `${FACEBOOK_BASE_URL}/${id}${FACEBOOK_PROFILE_IMAGE_URL}`,
      qs: { type: 'large', redirect: 0 },
      json: true
    });
  },
  getTestAccessToken: () => {
    const APP_ID = process.env.FACEBOOK_APP_ID || config.FACEBOOK_APP_ID;
    const APP_ACCESS_TOKEN = process.env.FACEBOOK_APP_ACCESS_TOKEN
      || config.FACEBOOK_APP_ACCESS_TOKEN;
    return request({
      uri: `${FACEBOOK_BASE_URL}/v2.8/${APP_ID}/accounts/test-users`,
      qs: { access_token: APP_ACCESS_TOKEN },
      json: true
    })
    .then(res => {
      return res.data[0].access_token;
    });
  }
};

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
  getUserKey: key => {
    return UserManager.getUser(key)
      .then(userData => {
        console.log('userData');
        console.log(userData);
        return userData.key;
      })
  }
  ,
  addAnonymousUser: (data) => {
    const userKey = UserManager.genUserKey();
    const userValue = {
      type: USER_TYPE.ANONYMOUS,
      name: 'guest',
      key: userKey
    };
    return bcrypt.hash(data.secret)
      .then(hash => {
        userValue.secret = hash;
        return UserManager.addUser(userKey, userValue);
      })
      .then(key => {
        const userIdx = UserManager.getUserIndexKey({
          userType: USER_TYPE.ANONYMOUS,
          secret: data.secret
        });
        return UserManager.addUser(userIdx, {key});
      });
  },
  addFacebookUser: (data) => {
    /*
      This method is called when facebook user sign up.
      It save user data(name, email, facebook) from facebook graph API.
      Also saved in db as 'user-timehash' and index like 'user-0-facebook-0000000(facebookId)'
      Likewise any other index, it only contains original user key in it.
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
        return UserManager.addUser(userKey, userValue);
      })
      .then(key => {
        const userIdx = UserManager.getUserIndexKey({
          userType: USER_TYPE.FACEBOOK,
          facebookId: facebookId
        });
        return UserManager.addUser(userIdx, {key});
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
