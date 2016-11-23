import test from 'tape';
import testDB, {initMock, clearDB, fetchPrefix} from '../../../server/database';
import httpMocks from 'node-mocks-http';
import Controller from '../../../server/users/controllers';
import {KeyUtils, ENTITY, STATE} from '../../../server/key-utils';
import AuthToken, {TOKEN_TYPE} from '../../../server/auth-token';
import {USER_TYPE} from '../../../server/users/models';
import FacebookManager from '../../../server/users/facebook-manager';
import {mockItems, mockSavedPosts, mockUsers, mockCreatedPosts}
        from '../../../server/database-mock-data';
import {STATE_STRING} from '../../../server/items/models';
test('get a user from database', t => {
  const expected = {
    key: 'user-unique-key',
    name: 'test-user',
    email: 'test@email.com',
    profileImgUrl: 'url-of-image'
  };
  testDB.put(expected.key, expected, (err) => {
    if (err) {
      t.fail(err);
      t.end();
      return;
    }
    const req = httpMocks.createRequest({
      method: 'GET',
      url: `api/users/${expected.key}`,
      params: {
        id: `${expected.key}`
      }
    });
    const res = httpMocks.createResponse();
    Controller.getById(req, res, () => {
      const value = res._getData();
      t.equal(value.key, expected.key, 'should be same key');
      t.equal(value.name, expected.name, 'should be same name');
      t.equal(value.email, expected.email, 'should be same email');
      t.equal(value.profileImgUrl, expected.profileImgUrl, 'should be same profileImgUrl');
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
    url: 'api/users',
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
    userType: USER_TYPE.ANONYMOUS
  };

  const req = httpMocks.createRequest({
    method: 'POST',
    url: 'api/users/signup',
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
        return AuthToken.decode(TOKEN_TYPE.ACCESS, data.accessToken)
          .then((decodedAccessToken) => {
            t.ok(decodedAccessToken.userKey, 'should be valid access token');
          })
          .then(() => {
            return AuthToken.decode(TOKEN_TYPE.REFRESH, data.refreshToken);
          })
          .then(decodedRefreshToken => {
            t.ok(decodedRefreshToken.userKey, 'should be valid refresh token');
          })
          .then(() => {
            t.ok(data.userKey, 'should have user key');
            t.ok(data.userSecret, 'should have user secret');
            t.end();
          })
          .catch(jwtErr => {
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
test('signup as a facebook user to database', t => {
  clearDB()
  .then(FacebookManager.getTestAccessToken)
  .then(mockFacebookToken => {
    const mockUser = {
      userType: USER_TYPE.FACEBOOK,
      facebookToken: mockFacebookToken
    };

    const req = httpMocks.createRequest({
      method: 'POST',
      url: 'api/users/signup',
      body: mockUser
    });
    const res = httpMocks.createResponse();

    return Controller.signup(req, res, (err) => {
      if (err) {
        t.fail();
        return t.end(err);
      }
      const data = res._getData();
      return AuthToken.decode(TOKEN_TYPE.ACCESS, data.accessToken)
        .then((decodedAccessToken) => {
          t.ok(decodedAccessToken.userKey, 'should be valid access token');
        })
        .then(() => {
          return AuthToken.decode(TOKEN_TYPE.REFRESH, data.refreshToken);
        })
        .then(decodedRefreshToken => {
          t.ok(decodedRefreshToken.userKey, 'should be valid refresh token');
          t.end();
        });
    });
  })
  .catch(err => {
    t.fail();
    t.end(err);
  });
});
test('get saved posts using user controller', t => {
  const testUser = mockUsers[0].value;
  const expected = {
    status: 200,
    userKey: testUser.key,
    // get a number of savedposts of test user
    length: mockSavedPosts.filter((post)=>{
      const prefix = `${ENTITY.SAVED_POST}-${STATE.ALIVE}-${testUser.key}`;
      return (post.key.startsWith(prefix));
    }).length
  };
  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/api/users/savedposts'
  });
  req.headers.userKey = testUser.key;
  const res = httpMocks.createResponse();
  clearDB().then(initMock)
  .then(()=>{
    Controller.getSavedPosts(req, res, () => {
      const posts = res._getData();
      const status = res.statusCode;
      t.equal(status, expected.status, 'should be same status');
      t.equal(posts.length, expected.length,
      `should be same length of posts array : ${posts.length}`);
      posts.map((post) => {
        if (post.userKey !== expected.userKey) {
          t.fail(`wrong user key : ${post.userKey}`);
          return;
        }
        t.notEqual(post.imageUrls.length, 0,
        `valid length of image url : ${post.imageUrls.length}`);
      });
      t.end();
    });
  }).catch((err)=>{
    t.fail();
    t.end(err);
  });
});
test('get created posts using user controller', t => {
  const testUser = mockUsers[0].value;
  const expected = {
    status: 200,
    userKey: testUser.key,
    // get a number of creatposts of test user
    length: mockCreatedPosts.filter((post)=>{
      return (post.key.indexOf(testUser.key) !== -1);
    }).length,
    states: [
      STATE_STRING[STATE.ALIVE],
      STATE_STRING[STATE.EXPIRED]
    ]
  };
  const req = httpMocks.createRequest({
    method: 'GET',
    url: `/api/users/createdPosts/${testUser.key}`,
    headers: `${testUser.key}`
  });
  req.headers.userKey = testUser.key;
  const res = httpMocks.createResponse();
  clearDB().then(initMock)
  .then(()=>{
    Controller.getCreatedPosts(req, res, () => {
      const posts = res._getData();
      const status = res.statusCode;
      t.equal(status, expected.status, 'should be same status');
      t.equal(posts.length, expected.length,
      `should ba same length of posts array : ${posts.length}`);
      posts.map((post) => {
        if (!post.imageUrl) {
          t.fail('there is no imageUrl Field');
        }
        if (expected.states.indexOf(post.state) === -1) {
          t.fail(`invalid state : ${post.state}`);
        }
        if (post.userKey !== expected.userKey) {
          t.fail(`wrong user key : ${post.userKey}`);
        }
      });
      t.end();
    });
  })
  .catch((err)=>{
    t.fail();
    t.end(err);
  });
});
test('delete saved post using user controller', t => {
  const testUser = mockUsers[0].value;
  const testItem = mockItems[0].value;
  const expected = {
    status: 200,
    length: mockSavedPosts.length - 1
  };
  const req = httpMocks.createRequest({
    method: 'DELETE',
    url: '/api/users/savedposts',
    body: {
      itemKey: testItem.key
    }
  });
  req.headers.userKey = testUser.key;
  const res = httpMocks.createResponse();
  clearDB().then(initMock)
  .then(() => {
    return new Promise((resolve, reject) => {
      Controller.deleteSavedPost(req, res, (err) => {
        return (err) ? reject(err) : resolve();
      });
    });
  }).then(() => {
    const status = res.statusCode;
    t.equal(status, expected.status, 'should be same status');
    fetchPrefix(`${ENTITY.SAVED_POST}-`, (err, values) => {
      if (err) {
        t.fail('fetchPrefix error');
        t.end(err);
        return;
      }
      t.equal(values.length, expected.length, `should be same length : ${expected.length}`);
      t.end();
    });
  }).catch((err) => {
    t.fail();
    t.end(err);
  });
});
