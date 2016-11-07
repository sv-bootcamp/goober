import test from 'tape';
import jwt, {TOKEN_TYPE} from './../../../server/auth-token';
import AuthController from '../../../server/auth/controllers';
import {GRANT_TYPE} from '../../../server/auth/models';
import {USER_TYPE} from '../../../server/users/models';
import db, {clearDB} from '../../../server/database';
import bcrypt from '../../../server/bcrypt';
import httpMocks from 'node-mocks-http';

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
test('grant anonymous user', t => {
  const mockUserSecret = 'userSecret';
  const mockUser = {
    key: 'userKey',
    type: USER_TYPE.ANONYMOUS
  };
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
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/auth/grant',
        body: {
          grantType: GRANT_TYPE.ANONYMOUS,
          userKey: mockUser.key,
          userSecret: mockUserSecret
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
test('grant facebook user', t => {
  const mockUser = {
    key: 'userKey',
    type: USER_TYPE.FACEBOOK,
    facebookToken: 'userFacebookToken'
  };
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
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/auth/grant',
        body: {
          grantType: GRANT_TYPE.FACEBOOK,
          userKey: mockUser.key,
          facebookToken: mockUser.facebookToken
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

// grant: (req, res, next) => {
//   const {grantType} = req.body;
//   let grant;
//   switch(grantType) {
//     case GRANT_TYPE.ANONYMOUS:
//       grant = AuthModel.grantAnonymous(req.body.userKey, req.body.userSecret);
//       break;
//     case GRANT_TYPE.FACEBOOK:
//       grant = AuthModel.grantFacebook(req.body.userKey, req.body.facebookToken);
//       break;
//     default:
//       break;
//   }
//
//   grant
//     .then((userKey) => {
//       res.send(AuthModel.encodeTokenSet(userKey));
//       return next();
//     })
//     .catch(err => {
//       if(err.message === 'notgranted') {
//         return next(new APIError(err, {
//           statusCode: 400,
//           message: err.message
//         }))
//       }
//       return next(
//         new APIError(err, {
//           statusCode: 500,
//           message: err.message
//         })
//       );
//     });
// }
