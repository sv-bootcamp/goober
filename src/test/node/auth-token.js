import test from 'tape';
import AuthToken, {TOKEN_TYPE} from '../../server/auth-token';

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
