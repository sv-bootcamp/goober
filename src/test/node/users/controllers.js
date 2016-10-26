import test from 'tape';
import controller from '../../../server/users/controllers';
import testDB from '../../../server/database';
import httpMocks from 'node-mocks-http';

const mockUser = {
  key: 'user-unique-key',
  name: 'test-user',
  email: 'test@email.com',
  password: 'secret-password',
  imagePath: 'url-of-image'
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
    controller.get(req, res, () => {
      const value = res._getData();
      t.equal(value.key, expected.key, 'should be same key');
      t.equal(value.name, expected.name, 'should be same name');
      t.end();
    });
  });
});
