import test from 'tape';
import jwt, {TOKEN_TYPE} from './../../../server/auth-token';
import AuthModel from '../../../server/auth/models';
import {STATE, ENTITY} from '../../../server/key-utils';
import {FacebookManager, USER_TYPE} from '../../../server/users/models';
import bcrypt from '../../../server/bcrypt';
import db, {clearDB} from '../../../server/database';
import config from 'config';

test('get token set', t => {
  const mockUserKey = 'userKey';
  const expected = {
    accessToken: {
      type: TOKEN_TYPE.ACCESS,
      user: mockUserKey
    },
    refreshToken: {
      type: TOKEN_TYPE.REFRESH,
      user: mockUserKey
    }
  };

  AuthModel.encodeTokenSet(mockUserKey)
    .then(tokenSet => {
      const accessToken = jwt.decode(TOKEN_TYPE.ACCESS, tokenSet.accessToken);
      const refreshToken = jwt.decode(TOKEN_TYPE.REFRESH, tokenSet.refreshToken);
      return Promise.all([accessToken, refreshToken]);
    })
    .then(decodedSet => {
      const accessToken = decodedSet[0];
      const refreshToken = decodedSet[1];
      t.equal(accessToken.type, expected.accessToken.type, 'should be same token type');
      t.equal(accessToken.user, expected.accessToken.user, 'should be same user');
      t.equal(refreshToken.type, expected.refreshToken.type, 'should be same token type');
      t.equal(refreshToken.user, expected.refreshToken.user, 'should be same user');
      t.end();
    });
});
test('grant anonymous user', t => {
  const mockUserSecret = 'userSecret';
  const mockUser = {
    key: 'userKey',
    type: USER_TYPE.ANONYMOUS
  };
  const mockUserIdxKey = `${ENTITY.USER}-${STATE.ALIVE}-${ENTITY.ANONYMOUS}-${mockUserSecret}`;

  bcrypt.hash(mockUserSecret)
    .then(hash => {
      mockUser.secret = hash;
    })
    .then(clearDB)
    .then(() => {
      return new Promise((resolve, reject) => {
        db.put(mockUser.key, mockUser, err => {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        db.put(mockUserIdxKey, {key: mockUser.key}, err => {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
      });
    })
    .then(() => {
      return AuthModel.grantAnonymous(mockUserSecret);
    })
    .then(userKey => {
      t.equal(userKey, mockUser.key, 'should be same user key');
      t.end();
    })
    .catch(err => {
      t.fail();
      t.end(err);
    });
});
test('grant facebook user', t => {
  const mockUser = {
    key: 'userKey',
    type: USER_TYPE.FACEBOOK,
    facebookId: config.FACEBOOK_TEST_ID
  };
  const mockUserIdxKey = `${ENTITY.USER}-${STATE.ALIVE}` +
    `-${ENTITY.FACEBOOK}-${mockUser.facebookId}`;

  clearDB()
    .then(() => {
      return new Promise((resolve, reject) => {
        db.put(mockUser.key, mockUser, err => {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        db.put(mockUserIdxKey, {key: mockUser.key}, err => {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
      });
    })
    .then(FacebookManager.getTestAccessToken)
    .then(mockFacebookToken => {
      return AuthModel.grantFacebook(mockFacebookToken);
    })
    .then(userKey => {
      t.equal(userKey, mockUser.key, 'should be same user key');
      t.end();
    })
    .catch(err => {
      t.fail();
      t.end(err);
    });
});