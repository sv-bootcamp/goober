import test from 'tape';
import jwt, {TOKEN_TYPE} from './../../../server/auth-token';
import AuthModel from '../../../server/auth/models';

test('get token set', t => {

  const mockUserKey = 'userKey';
  const expected = {
    accessToken: {
      type: TOKEN_TYPE.ACCESS,
      user: mockUserKey
    },
    refreshToken: {
      type: TOKEN_TYPE.REFRESH,
      user: mockUserKey
    }
  };

  AuthModel.encodeTokenSet(mockUserKey)
    .then(tokenSet => {
      const accessToken = jwt.decode(TOKEN_TYPE.ACCESS, tokenSet.accessToken);
      const refreshToken = jwt.decode(TOKEN_TYPE.REFRESH, tokenSet.refreshToken);
      return Promise.all([accessToken, refreshToken]);
    })
    .then(decodedSet => {
      const accessToken = decodedSet[0];
      const refreshToken = decodedSet[1];
      t.equal(accessToken.type, expected.accessToken.type, 'should be same token type');
      t.equal(accessToken.user, expected.accessToken.user, 'should be same user');
      t.equal(refreshToken.type, expected.refreshToken.type, 'should be same token type');
      t.equal(refreshToken.user, expected.refreshToken.user, 'should be same user');
      t.end();
    });
});

