import test from 'tape';
import testDB, {clearDB} from '../../../server/database';
// import httpMocks from 'node-mocks-http';
import userModel, {USER_TYPE} from '../../../server/users/models';
import {ENTITY} from '../../../server/key-utils';

test('generate user key', t => {
  const expected = {
    prefix: 'user'
  };
  const userKey = userModel.genUserKey();
  const prefix = userKey.split('-')[0];
  t.equal(prefix, expected.prefix, 'should be same prefix user');
  t.end();
});

test('add user', t => {
  const mockUser = {
    key : userModel.genUserKey(),
    secret: 'userSecret'
  };
  const expected = {
    value: mockUser
  };

  clearDB()
    .then(() => {
      return userModel.addUser(expected.value.key, expected.value);
    })
    .then(() => {
      testDB.get(expected.value.key, (err, data) => {
        t.equal(data.secret, expected.value.secret, 'should have same secret');
        t.end();
      });
    });
});

test('add Anonymous user', t => {
  const mockUser = {
    secret: 'userSecret'
  };
  const expected = {
    type: USER_TYPE.ANONYMOUS,
    value: mockUser
  };

  clearDB()
    .then(() => {
      return userModel.addAnonymousUser(mockUser);
    })
    .catch((err) => {
      t.fail('Error while add Anonymous User to DB');
      t.end(err);
    })
    .then(() => {
      let savedUser;
      testDB.createReadStream({
        start: `${ENTITY.USER}-\x00`,
        end: `${ENTITY.USER}-\xFF`
      }).on('data', (data) => {
        savedUser = data.value;
      }).on('error', (err) => {
        t.fail('Error while read Anonymous User from DB');
        t.end(err);
      }).on('close', () => {
        t.equal(savedUser.type, expected.type, 'should have same user type anonymous');
        t.equal(savedUser.secret, expected.value.secret, 'should have same secret');
        t.end();
      });
    });
});

test('add Facebook user', t => {
  const mockUser = {
    facebookToken: 'facebookToken'
  };
  const expected = {
    type: USER_TYPE.FACEBOOK,
    value: mockUser
  };

  clearDB()
    .then(() => {
      return userModel.addFacebookUser(mockUser);
    })
    .then(() => {
      let savedUser;
      testDB.createReadStream({
        start: `${ENTITY.USER}-\x00`,
        end: `${ENTITY.USER}-\xFF`
      }).on('data', (data) => {
        savedUser = data.value;
      }).on('error', (err) => {
        t.fail('Error while read Facebook User from DB');
        t.end(err);
      }).on('close', () => {
        t.equal(savedUser.type, expected.type, 'should have same user type facebook');
        t.equal(savedUser.facebookToken, expected.value.facebookToken,
          'should have same facebookToken');
        t.end();
      });
    });
});
