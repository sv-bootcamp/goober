import test from 'tape';
import testDB, {initMock, clearDB} from '../../../server/database';
import {mockUsers, mockCreatedPosts} from '../../../server/database-mock-data';
import UserModel, {USER_TYPE} from '../../../server/users/models';
import UserManager, {CreatedPostManager, SavedPostManager} from '../../../server/users/models';
import {KeyUtils, ENTITY, STATE, CATEGORY} from '../../../server/key-utils';
import bcrypt from './../../../server/bcrypt';
import {STATE_STRING} from '../../../server/items/models';

test('generate user key', t => {
  const expected = {
    prefix: 'user'
  };
  const userKey = UserModel.genUserKey();
  const prefix = userKey.split('-')[0];
  t.equal(prefix, expected.prefix, 'should be same prefix user');
  t.end();
});

test('add user', t => {
  const mockUser = {
    key: UserModel.genUserKey(),
    secret: 'userSecret'
  };
  const expected = {
    value: mockUser
  };

  clearDB()
  .then(() => {
    return UserModel.addUser(expected.value.key, expected.value);
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
    return UserModel.addAnonymousUser(mockUser);
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
      t.ok(bcrypt.compare(expected.value.secret, savedUser.secret), 'should have same secret');
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
      return UserModel.addFacebookUser(mockUser);
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
const mockItem = {
  title: 'mock item',
  lat: 37.765432,
  lng: -122.43210,
  address: 'address of mock item',
  createdDate: '2016-10-10T01:11:46.851Z',
  modifiedDate: '2016-10-10T01:11:46.851Z',
  category: CATEGORY.WARNING,
  startTime: '2016-10-10T01:11:46.851Z',
  endTime: '2017-01-01T10:10:10.851Z',
  state: STATE_STRING[STATE.ALIVE],
  key: 'item-8520000000000-mockitem-aaaa-aaaa-1234-mockitemuuid',
  userKey: 'user-8550000000000-mockuser-zzzz-zzzz-1234-mockuseruuid'
};
const mockUser = {
  key: 'user-unique-key',
  name: 'test-user',
  email: 'test@email.com',
  password: 'secret-password',
  imageUrl: 'url-of-image'
};
test('add created posts with user key', t => {
  const timeHash = KeyUtils.genTimeHash(new Date());
  new Promise((resolve, reject) => {
    CreatedPostManager.addCreatedPost(ENTITY.ITEM, mockItem.key, mockItem.userKey, timeHash,
    (err, key) => {
      return (err) ? reject(err) : resolve(key);
    });
  }).then((key)=>{
    return new Promise((resolve, reject) => {
      testDB.get(key, (err, item) => {
        return (err) ? reject(err) : resolve(item);
      });
    });
  }).then((item)=>{
    t.equal(item.key, mockItem.key, 'should be same key');
    t.end();
  }).catch((err)=>{
    t.fail(err);
    t.end();
  });
});
test('add saved posts with user key', t => {
  const timeHash = KeyUtils.genTimeHash(new Date());
  new Promise((resolve, reject) => {
    SavedPostManager.addSavedPost(mockItem.key, mockItem.userKey, timeHash, (err, key)=>{
      return (err) ? reject(err) : resolve(key);
    });
  }).then((key)=>{
    return new Promise((resolve, reject) => {
      testDB.get(key, (err, item) => {
        return (err) ? reject(err) : resolve(item);
      });
    });
  }).then((item)=>{
    t.equal(item.key, mockItem.key, 'should be same key');
    t.end();
  }).catch((err)=>{
    t.fail(err);
    t.end();
  });
});
test('modify a user(UserManager.modifyUser)', t => {
  const modifedUser = {
    key: mockUser.key,
    name: 'modified-user',
    email: 'modified@email.com',
    password: 'modifed-secret-password',
    imageUrl: 'url-of-image'
  };
  clearDB().then(initMock).then(()=>{
    return new Promise((resolve, reject) => {
      testDB.put(mockUser.key, mockUser, (err) => {
        return (err) ? reject(err) : resolve();
      });
    });
  }).then(()=>{
    return new Promise((resolve, reject) => {
      UserManager.modifyUser(mockUser.key, modifedUser, (err) => {
        return (err) ? reject(err) : resolve();
      });
    });
  }).then(()=>{
    return new Promise((resolve, reject) => {
      testDB.get(mockUser.key, (err, value) => {
        if (err) {
          reject(err);
          return;
        }
        t.equal(value.key, modifedUser.key, 'should be same key');
        t.equal(value.name, modifedUser.name, 'should be same name');
        t.equal(value.email, modifedUser.email, 'should be same email');
        t.equal(value.password, modifedUser.password, 'should be same password');
        t.equal(value.imageUrl, modifedUser.imageUrl, 'should be same imageUrl');
        t.end();
        resolve();
      });
    });
  }).catch((err)=>{
    t.fail();
    t.end(err);
  });
});
test('get created post keys of a user', t => {
  const testUser = mockUsers[0].value;
  const expected = {
    // get a number of posts of test user
    length: mockCreatedPosts.filter((post)=>{
      return post.key.includes(testUser.key);
    }).length
  };
  UserManager.getPostKeys(ENTITY.CREATED_POST, testUser.key, (err, values) => {
    if (err) {
      t.fail('Error while reading from DB');
      t.end();
      return;
    }
    t.equal(values.length, expected.length,
      `should be same number of size : ${values.length}`);
    t.end();
  });
});
