import test from 'tape';
import UserController from '../../../server/controllers/user';
import httpMocks from 'node-mocks-http';

const mockFb = (expected) => ({
  setAccessToken: () => {
  },
  api: (path, cb) => {
    cb(expected);
  }
});

test('get with valid access token', t => {
  const accessToken = 'valid access Token';
  const expected = {
    id: '1',
    name: 'Taehoon Kang'
  };

  const res = httpMocks.createResponse();
  UserController.get(accessToken, res, mockFb(expected));
  /* eslint-disable no-underscore-dangle */
  const data = JSON.parse(res._getData());
  /* eslint-enable no-underscore-dangle */

  t.equal(data.name, expected.name, 'should be same user');
  t.end();
});

test('get with wrong access token', t => {
  const accessToken = 'wrong access Token';
  const expected = {
    error: {
      type: 'OAuthException'
    }
  };

  const res = httpMocks.createResponse();
  UserController.get(accessToken, res, mockFb(expected));
  t.equal(res.statusCode, 401, 'returns status code 401 with wrong access token');
  t.end();
});
