import test from 'tape';
import testDB, {initMock, clearDB} from '../../../server/database';
import httpMocks from 'node-mocks-http';
import Controller from '../../../server/users/controllers';
import {KeyUtils, ENTITY} from '../../../server/key-utils';
import jwt, {TOKEN_TYPE} from '../../../server/auth-token';
import {FacebookManager} from '../../../server/users/models';

test('get a user from database', t => {
  const expected = {
    key: 'user-unique-key',
    name: 'test-user',
    email: 'test@email.com',
    password: 'secret-password',
    imageUrl: 'url-of-image'
  };
  testDB.put(expected.key, expected, (err) => {
    if (err) {
      t.fail(err);
      t.end();
      return;
    }
    const req = httpMocks.createRequest({
      method: 'GET',
      url: `/users/${expected.key}`,
      params: {
        id: `${expected.key}`
      }
    });
    const res = httpMocks.createResponse();
    Controller.get(req, res, () => {
      const value = res._getData();
      t.equal(value.key, expected.key, 'should be same key');
      t.equal(value.name, expected.name, 'should be same name');
      t.end();
    });
  });
});
test('add a user to database', t => {
  const mockUser = {
    key: 'user-unique-key',
    name: 'test-user',
    email: 'test@email.com',
    password: 'secret-password',
    imageUrl: 'url-of-image'
  };
  const expected = {
    status: 200,
    message: 'success',
    email: mockUser.email
  };
  const req = httpMocks.createRequest({
    method: 'POST',
    url: '/users',
    body: mockUser
  });
  const res = httpMocks.createResponse();
  clearDB().then(initMock).then(() => {
    return new Promise((resolve) => {
      Controller.post(req, res, resolve);
    });
  }).then(()=>{
    const status = res.statusCode;
    const message = res._getData().message;
    const key = res._getData().data;
    const timeHash = KeyUtils.parseTimeHash(key);
    t.equal(status, expected.status, 'should be same status');
    t.equal(message, expected.message, 'should be same message');
    let error;
    let addedUser;
    let addedIdxUser;
    testDB.createReadStream({
      start: `${ENTITY.USER}-\x00`,
      end: `${ENTITY.USER}-\xFF`
    }).on('data', (data) => {
      if (data.key.includes(timeHash)) {
        if (KeyUtils.isOriginKey(data.key)) {
          addedUser = data.value;
        } else {
          addedIdxUser = data.value;
        }
      }
    }).on('error', (err) => {
      error = err;
    }).on('close', () => {
      if (error) {
        t.fail('database error');
        t.end();
        return;
      }
      t.equal(addedUser.email, expected.email,
      'should be same email');
      t.equal(addedIdxUser.key, addedUser.key,
      'should be same key');
      t.end();
    });
  }).catch((err) => {
    t.fail('Error while reading from DB');
    t.end(err);
  });
});

test('signup as a anonymous user to database', t => {
  const mockUser = {
    userType: 'anonymous',
    secret: 'anonymousSecret'
  };

  const req = httpMocks.createRequest({
    method: 'POST',
    url: '/users/signup',
    body: mockUser
  });

  const res = httpMocks.createResponse();

  clearDB()
    .then(() => {
      return Controller.signup(req, res, (err) => {
        if (err) {
          t.fail();
          return t.end(err);
        }
        const data = res._getData();
        return jwt.decode(TOKEN_TYPE.ACCESS, data.accessToken)
          .then((decodedAccessToken) => {
            t.ok(decodedAccessToken.user, 'should be valid access token');
          })
          .then(() => {
            return jwt.decode(TOKEN_TYPE.REFRESH, data.refreshToken);
          })
          .then(decodedRefreshToken => {
            t.ok(decodedRefreshToken.user, 'should be valid refresh token');
            t.end();
          })
          .catch(jwtErr => {
            console.log(jwtErr);
            t.fail(jwtErr);
            t.end();
          });
      });
    })
    .catch(err => {
      t.fail(err);
      t.end();
    });
});

test('add created post using user controller', t => {
  const testBody = {
    entity:	ENTITY.IMAGE,
    entityKey:	'test-image-key',
    userKey:	'test-users-key'
  };
  const expected = {
    status: 200,
    key: testBody.entityKey
  };
  const req = httpMocks.createRequest({
    method: 'POST',
    url: '/users/createdpost',
    body: testBody
  });
  const res = httpMocks.createResponse();
  clearDB().then(initMock).then(() => {
    return new Promise((resolve) => {
      Controller.addCreatedPost(req, res, resolve);
    });
  }).then(()=>{
    return new Promise((resolve, reject) => {
      const status = res.statusCode;
      const key = res._getData().data;
      t.equal(status, expected.status, 'should be same status');
      if (typeof key !== 'string' || !key.includes(testBody.userKey)) {
        t.fail(`wrong key : ${key}`);
        t.end();
        return;
      }
      testDB.get(key, (err, value) => {
        return (err) ? reject(err) : resolve(value);
      });
    });
  }).then((value) => {
    t.equal(value.key, expected.key, 'should be same key');
    t.end();
  }).catch((err) => {
    t.fail(err);
    t.end();
  });
});

test('signup as a facebook user to database', t => {
  clearDB()
  .then(FacebookManager.getTestAccessToken)
  .then(mockFacebookToken => {
    const mockUser = {
      userType: 'facebook',
      facebookToken: mockFacebookToken
    };

    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/users/signup',
      body: mockUser
    });
    const res = httpMocks.createResponse();

    return Controller.signup(req, res, (err) => {
      if (err) {
        t.fail();
        return t.end(err);
      }
      const data = res._getData();
      return jwt.decode(TOKEN_TYPE.ACCESS, data.accessToken)
        .then((decodedAccessToken) => {
          t.ok(decodedAccessToken.user, 'should be valid access token');
        })
        .then(() => {
          return jwt.decode(TOKEN_TYPE.REFRESH, data.refreshToken);
        })
        .then(decodedRefreshToken => {
          t.ok(decodedRefreshToken.user, 'should be valid refresh token');
          t.end();
        });
    });
  })
  .catch(err => {
    t.fail();
    t.end(err);
  });
});
test('add posted post using user controller', t => {
  const testBody = {
    entityKey:	'test-image-key',
    userKey:	'test-users-key'
  };
  const expected = {
    status: 200,
    key: testBody.entityKey
  };
  const req = httpMocks.createRequest({
    method: 'POST',
    url: '/users/savedpost',
    body: testBody
  });
  const res = httpMocks.createResponse();
  clearDB().then(initMock).then(() => {
    return new Promise((resolve) => {
      Controller.addSavedPost(req, res, resolve);
    });
  }).then(()=>{
    return new Promise((resolve, reject) => {
      const status = res.statusCode;
      const key = res._getData().data;
      t.equal(status, expected.status, 'should be same status');
      if (typeof key !== 'string' || !key.includes(testBody.userKey)) {
        t.fail(`key is wrong: ${key}`);
        t.end();
        return;
      }
      testDB.get(key, (err, value) => {
        return (err) ? reject(err) : resolve(value);
      });
    });
  }).then((value) => {
    t.equal(value.key, expected.key, 'should be same key');
    t.end();
  }).catch((err) => {
    t.fail(err);
    t.end();
  });
});
