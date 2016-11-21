import test from 'tape';
import jwt, {TOKEN_TYPE} from '../../../server/auth-token';
import AuthModel from '../../../server/auth/models';
import bcrypt from '../../../server/bcrypt';
import {USER_TYPE} from '../../../server/users/models';
import FacebookManager from '../../../server/users/facebook-manager';
import {clearDB, putPromise} from '../../../server/database';
import config from 'config';
import {STATE, ENTITY} from '../../../server/key-utils';

test('get token set', t => {
  const mockUser = {
    userType: USER_TYPE.ANONYMOUS,
    userKey: 'userKey'
  };
  const expected = {
    accessToken: {
      tokenType: TOKEN_TYPE.ACCESS,
      userType: USER_TYPE.ANONYMOUS,
      userKey: mockUser.userKey
    },
    refreshToken: {
      tokenType: TOKEN_TYPE.REFRESH,
      userType: USER_TYPE.ANONYMOUS,
      userKey: mockUser.userKey
    }
  };

  AuthModel.encodeTokenSet(mockUser)
    .then(tokenSet => {
      const accessToken = jwt.decode(TOKEN_TYPE.ACCESS, tokenSet.accessToken);
      const refreshToken = jwt.decode(TOKEN_TYPE.REFRESH, tokenSet.refreshToken);
      return Promise.all([accessToken, refreshToken]);
    })
    .then(decodedSet => {
      const accessToken = decodedSet[0];
      const refreshToken = decodedSet[1];
      t.equal(accessToken.tokenType, expected.accessToken.tokenType, 'should be same token type');
      t.equal(accessToken.userKey, expected.accessToken.userKey, 'should be same user key');
      t.equal(accessToken.userType, expected.accessToken.userType, 'should be same user type');
      t.equal(refreshToken.tokenType, expected.refreshToken.tokenType, 'should be same token type');
      t.equal(refreshToken.userKey, expected.refreshToken.userKey, 'should be same user key');
      t.equal(refreshToken.userType, expected.refreshToken.userType, 'should be same user type');
      t.end();
    });
});
test('grant anonymous user', t => {
  const mockUserSecret = 'userSecret';
  const mockUser = {
    key: 'userKey',
    type: USER_TYPE.ANONYMOUS
  };

  clearDB()
    .then(() => {
      return bcrypt.hash(mockUserSecret)
        .then(hash => {
          mockUser.hash = hash;
          return putPromise(mockUser.key, mockUser);
        });
    })
    .then(() => {
      return AuthModel.grantAnonymous(mockUser.key, mockUserSecret);
    })
    .then(userData => {
      t.equal(userData.userType, mockUser.type, 'should be same user type');
      t.equal(userData.userKey, mockUser.key, 'should be same user key');
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
    facebookId: process.env.FACEBOOK_TEST_ID || config.FACEBOOK_TEST_ID
  };
  const mockUserIdxKey = `${ENTITY.USER}-${STATE.ALIVE}` +
    `-${ENTITY.FACEBOOK}-${mockUser.facebookId}`;

  clearDB()
    .then(() => {
      return putPromise(mockUser.key, mockUser);
    })
    .then(() => {
      return putPromise(mockUserIdxKey, {key: mockUser.key});
    })
    .then(FacebookManager.getTestAccessToken)
    .then(AuthModel.grantFacebook)
    .then(userData => {
      t.equal(userData.userKey, mockUser.key, 'should be same user key');
      t.equal(userData.userType, mockUser.type, 'should be same user type');
      t.end();
    })
    .catch(err => {
      t.fail();
      t.end(err);
    });
});
