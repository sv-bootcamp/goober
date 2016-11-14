import test from 'tape';
import AuthToken, {TOKEN_TYPE} from './../../../server/auth-token';
import AuthController from '../../../server/auth/controllers';
import {GRANT_TYPE} from '../../../server/auth/models';
import {USER_TYPE} from '../../../server/users/models';
import FacebookManager from '../../../server/users/facebook-manager';
import {STATE, ENTITY} from '../../../server/key-utils';
import {clearDB, putPromise} from '../../../server/database';
import bcrypt from '../../../server/bcrypt';
import httpMocks from 'node-mocks-http';
import config from 'config';

test('refresh token', t => {
  const mockUser = {
    user: 'mockUserKey'
  };
  AuthToken.encode(TOKEN_TYPE.REFRESH, mockUser)
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
        url: 'api/auth/refresh',
        body: {refreshToken: mockRefreshToken}
      });
      const res = httpMocks.createResponse();

      AuthController.refreshToken(req, res, () => {
        const tokenSet = res._getData();
        const accessToken = AuthToken.decode(TOKEN_TYPE.ACCESS, tokenSet.accessToken);
        const refreshToken = AuthToken.decode(TOKEN_TYPE.REFRESH, tokenSet.refreshToken);
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
    userId: 'userId',
    type: USER_TYPE.ANONYMOUS
  };
  let mockUserIdxKey;

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
      mockUserIdxKey = `${ENTITY.USER}-${STATE.ALIVE}-${ENTITY.ANONYMOUS}-${mockUser.userId}`;
      mockUser.hash = hash;
    })
    .then(clearDB)
    .then(() => {
      return putPromise(mockUser.key, mockUser);
    })
    .then(() => {
      return putPromise(mockUserIdxKey, {key: mockUser.key});
    })
    .then(() => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: 'api/auth/grant',
        body: {
          grantType: GRANT_TYPE.ANONYMOUS,
          userId: mockUser.userId,
          secret: mockUserSecret
        }
      });
      const res = httpMocks.createResponse();
      return AuthController.grant(req, res, (err) => {
        if (err) {
          return t.end(err);
        }
        const tokenSet = res._getData();
        const accessToken = AuthToken.decode(TOKEN_TYPE.ACCESS, tokenSet.accessToken);
        const refreshToken = AuthToken.decode(TOKEN_TYPE.REFRESH, tokenSet.refreshToken);
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
          });
      });
    })
    .catch(err => {
      t.fail();
      t.end(err);
    });
});
test('grant facebook user in controller', t => {
  const mockUser = {
    key: 'userKey',
    type: USER_TYPE.FACEBOOK,
    facebookId: process.env.FACEBOOK_TEST_ID || config.FACEBOOK_TEST_ID
  };
  const mockUserIdxKey = `${ENTITY.USER}-${STATE.ALIVE}` +
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
      return putPromise(mockUser.key, mockUser);
    })
    .then(() => {
      return putPromise(mockUserIdxKey, {key: mockUser.key});
    })
    .then(FacebookManager.getTestAccessToken)
    .then(mockFacebookToken => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: 'api/auth/grant',
        body: {
          grantType: GRANT_TYPE.FACEBOOK,
          facebookToken: mockFacebookToken
        }
      });
      const res = httpMocks.createResponse();
      return AuthController.grant(req, res, () => {
        const tokenSet = res._getData();
        const accessToken = AuthToken.decode(TOKEN_TYPE.ACCESS, tokenSet.accessToken);
        const refreshToken = AuthToken.decode(TOKEN_TYPE.REFRESH, tokenSet.refreshToken);
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

test('should valid access token', t => {
  const mockUser = {
    userId: 'mockUserId',
    name: 'mockUserName'
  };

  AuthToken.encode(TOKEN_TYPE.ACCESS, mockUser)
  .then(validAccessToken => {
    const expected = {
      message: 'Access Token is valid.'
    };
    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'api/auth/validate',
      body: {
        accessToken: validAccessToken
      }
    });
    const res = httpMocks.createResponse();
    AuthController.validate(req, res, () => {
      if (res.statusCode === 400) {
        t.fail('Validation is failed');
        return t.end();
      }
      const {message} = res._getData();

      t.equal(message, expected.message, 'should be same message.');
      return t.end();
    });
  });
});

test('should invalid access token', t => {
  const invalidAccessToken = 'THIS_IS_INVALID_ACCESS_TOKEN';

  const req = httpMocks.createRequest({
    method: 'POST',
    url: 'api/auth/validate',
    body: {
      accessToken: invalidAccessToken
    }
  });

  const expected = {
    message: 'Access Token is invalid'
  };

  const res = httpMocks.createResponse();
  AuthController.validate(req, res, () => {
    if (res.statusCode === 400) {
      const {message} = res._getData();
      t.equal(message, expected.message, 'should be same message.');
      return t.end();
    }

    t.fail('Validation is failed');
    return t.end();
  });
});
