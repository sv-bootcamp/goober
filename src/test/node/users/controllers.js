import test from 'tape';
import testDB, {initMock, clearDB} from '../../../server/database';
import httpMocks from 'node-mocks-http';
import Controller from '../../../server/users/controllers';
import {KeyUtils} from '../../../server/key-utils';
import {ENTITY} from '../../../server/constants';
const mockUser = {
  key: 'user-unique-key',
  name: 'test-user',
  email: 'test@email.com',
  password: 'secret-password',
  imageUrl: 'url-of-image'
};

test('get a user from database', t => {
  const expected = mockUser;
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
