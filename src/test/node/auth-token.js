import test from 'tape';
import httpMocks from 'node-mocks-http';
import AuthToken, {TOKEN_TYPE} from '../../server/auth-token';
import {USER_TYPE, USER_PERMISSION} from '../../server/users/models';

test('test auto token instance', t => {
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
    userType: USER_TYPE.ANONYMOUS,
    userKey: 'mockUserKey'
  };
  const expected = {
    permission: USER_PERMISSION[mockUser.userType],
    userKey: mockUser.userKey
  };
  AuthToken.encode(TOKEN_TYPE.ACCESS, mockUser)
    .then((accessToken) => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: 'api/users',
        headers: {
          authorization: 'Bearer ' + accessToken
        }
      });
      const res = httpMocks.createResponse();

      AuthToken.authenticate(req, res, () => {
        t.equal(req.headers.userKey, expected.userKey, 'should be same userKey');
        t.equal(req.headers.permission, expected.permission, 'should be same permission');
        t.end();
      });
    })
    .catch(err => {
      t.fail(err);
      t.end();
    });
});
