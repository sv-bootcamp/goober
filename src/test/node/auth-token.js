import test from 'tape';
import httpMocks from 'node-mocks-http';
import AuthToken, {TOKEN_TYPE} from '../../server/auth-token';

test('test token instance', t => {
  const payload = {
    name: 'goober'
  };
  const expected = {
    payload
  };
  AuthToken.encode(TOKEN_TYPE.ACCESS, payload)
    .then((encoded) => {
      return AuthToken.decode(TOKEN_TYPE.ACCESS, encoded);
    })
    .then((decoded) => {
      t.equal(decoded.name, expected.payload.name, 'decoded token should be same name');
      t.end();
    })
    .catch(() => {
      t.fail('decoded token is not same with payload');
      t.end();
    });
});

test('test authenticate user', t => {
  const mockUser = {
    user: 'mockUserKey'
  };
  const expected = {
    userKey: mockUser.user
  };
  AuthToken.encode(TOKEN_TYPE.ACCESS, mockUser)
    .then((accessToken) => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/users',
        headers: {
          authorization: 'Bearer ' + accessToken
        }
      });
      const res = httpMocks.createResponse();

      AuthToken.authenticate(req, res, () => {
        t.equal(req.headers.userKey, expected.userKey, 'should be same userKey');
        t.end();
      });
    })
    .catch(err => {
      t.fail(err);
      t.end();
    });
});
