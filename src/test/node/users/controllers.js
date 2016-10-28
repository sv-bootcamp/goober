import test from 'tape';
import testDB, {initMock, clearDB} from '../../../server/database';
import httpMocks from 'node-mocks-http';
import Controller from '../../../server/users/controllers';
import {KeyUtils, ENTITY} from '../../../server/key-utils';

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
