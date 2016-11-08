import test from 'tape';
import jwt, {TOKEN_TYPE} from './../../../server/auth-token';
import AuthController from '../../../server/auth/controllers';
import {GRANT_TYPE} from '../../../server/auth/models';
import {FacebookManager, USER_TYPE} from '../../../server/users/models';
import {STATE, ENTITY} from '../../../server/key-utils';
import db, {clearDB} from '../../../server/database';
import bcrypt from '../../../server/bcrypt';
import httpMocks from 'node-mocks-http';
import config from 'config';

test('refresh token', t => {
  const mockUser = {
    user: 'mockUserKey'
  };
  jwt.encode(TOKEN_TYPE.REFRESH, mockUser)
    .then((mockRefreshToken) => {
      const expected = {
        accessToken: {
          type: TOKEN_TYPE.ACCESS,
          user: mockUser.user
        },
        refreshToken: {
          type: TOKEN_TYPE.REFRESH,
          user: mockUser.user
        }
      };
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/users',
        body: {refreshToken: mockRefreshToken}
      });
      const res = httpMocks.createResponse();

      AuthController.refreshToken(req, res, () => {
        const tokenSet = res._getData();
        const accessToken = jwt.decode(TOKEN_TYPE.ACCESS, tokenSet.accessToken);
        const refreshToken = jwt.decode(TOKEN_TYPE.REFRESH, tokenSet.refreshToken);
        Promise.all([accessToken, refreshToken])
        .then(decodedSet => {
          const decodedAccessToken = decodedSet[0];
          const decodedRefreshToken = decodedSet[1];
          t.equal(decodedAccessToken.type, expected.accessToken.type,
            'should be same token type');
          t.equal(decodedAccessToken.user, expected.accessToken.user,
            'should be same user');
          t.equal(decodedRefreshToken.type, expected.refreshToken.type,
            'should be same token type');
          t.equal(decodedRefreshToken.user, expected.refreshToken.user,
            'should be same user');
          t.end();
        })
        .catch(err => {
          t.fail(err);
          t.end();
        });
      });
    });
});
test('grant anonymous user in userController', t => {
  const mockUserSecret = 'userSecret';
  const mockUser = {
    key: 'userKey',
    type: USER_TYPE.ANONYMOUS
  };
  const mockUserIdxKey = `${ENTITY.USER}-${STATE.ALIVE}-${ENTITY.ANONYMOUS}-${mockUserSecret}`;

  const expected = {
    accessToken: {
      type: TOKEN_TYPE.ACCESS,
      user: mockUser.key
    },
    refreshToken: {
      type: TOKEN_TYPE.REFRESH,
      user: mockUser.key
    }
  };

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
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/auth/grant',
        body: {
          grantType: GRANT_TYPE.ANONYMOUS,
          userSecret: mockUserSecret
        }
      });
      const res = httpMocks.createResponse();
      return AuthController.grant(req, res, (err) => {
        if (err) {
          return t.end(err);
        }
        const tokenSet = res._getData();
        const accessToken = jwt.decode(TOKEN_TYPE.ACCESS, tokenSet.accessToken);
        const refreshToken = jwt.decode(TOKEN_TYPE.REFRESH, tokenSet.refreshToken);
        return Promise.all([accessToken, refreshToken])
          .then(decodedSet => {
            const decodedAccessToken = decodedSet[0];
            const decodedRefreshToken = decodedSet[1];
            t.equal(decodedAccessToken.type, expected.accessToken.type,
              'should be same token type');
            t.equal(decodedAccessToken.user, expected.accessToken.user,
              'should be same user');
            t.equal(decodedRefreshToken.type, expected.refreshToken.type,
              'should be same token type');
            t.equal(decodedRefreshToken.user, expected.refreshToken.user,
              'should be same user');
            t.end();
          })
      });
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
  const mockUserIdxKey = `${ENTITY.USER}-${STATE.ALIVE}`+
    `-${ENTITY.FACEBOOK}-${mockUser.facebookId}`;
  const expected = {
    accessToken: {
      type: TOKEN_TYPE.ACCESS,
      user: mockUser.key
    },
    refreshToken: {
      type: TOKEN_TYPE.REFRESH,
      user: mockUser.key
    }
  };
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
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/auth/grant',
        body: {
          grantType: GRANT_TYPE.FACEBOOK,
          facebookToken: mockFacebookToken
        }
      });
      const res = httpMocks.createResponse();
      return AuthController.grant(req, res, () => {
        const tokenSet = res._getData();
        const accessToken = jwt.decode(TOKEN_TYPE.ACCESS, tokenSet.accessToken);
        const refreshToken = jwt.decode(TOKEN_TYPE.REFRESH, tokenSet.refreshToken);
        Promise.all([accessToken, refreshToken])
          .then(decodedSet => {
            const decodedAccessToken = decodedSet[0];
            const decodedRefreshToken = decodedSet[1];
            t.equal(decodedAccessToken.type, expected.accessToken.type,
              'should be same token type');
            t.equal(decodedAccessToken.user, expected.accessToken.user,
              'should be same user');
            t.equal(decodedRefreshToken.type, expected.refreshToken.type,
              'should be same token type');
            t.equal(decodedRefreshToken.user, expected.refreshToken.user,
              'should be same user');
            t.end();
          })
          .catch(err => {
            t.fail(err);
            t.end();
          });
      });
    })
    .catch(err => {
      t.fail();
      t.end(err);
    });
});
