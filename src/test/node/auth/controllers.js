import test from 'tape';
import jwt, {TOKEN_TYPE} from './../../../server/auth-token';
import AuthController from '../../../server/auth/controllers';
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
      })
    });
});
