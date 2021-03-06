import test from 'tape';
import testDB, {initMock, clearDB, fetchPrefix, getPromise} from '../../../server/database';
import {mockUsers, mockCreatedPosts, mockSavedPosts, mockItems, mockImages,
        CREATED_POSTS_LENGTH_OF_TEST_USER} from '../../../server/database-mock-data';
import UserModel, {USER_TYPE} from '../../../server/users/models';
import UserManager, {CreatedPostManager, SavedPostManager} from '../../../server/users/models';
import FacebookManager from '../../../server/users/facebook-manager';
import {KeyUtils, ENTITY, STATE, CATEGORY} from '../../../server/key-utils';
import bcrypt from './../../../server/bcrypt';
import {STATE_STRING} from '../../../server/items/models';
import config from 'config';
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
test('generate user key', t => {
  const expected = {
    prefix: 'user'
  };
  const userKey = UserModel.genUserKey();
  const prefix = userKey.split('-')[0];
  t.equal(prefix, expected.prefix, 'should be same prefix user');
  t.end();
});
test('add Anonymous user', t => {
  const testUser = {
    userId: 'userId',
    secret: 'userSecret'
  };
  const expected = {
    type: USER_TYPE.ANONYMOUS,
    value: testUser
  };

  clearDB()
  .then(() => {
    return UserModel.addAnonymousUser(testUser);
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
      bcrypt.compare(testUser.secret, savedUser.hash)
        .then(result => {
          t.ok(result, 'should have same secret');
        })
        .catch(err => {
          t.fail();
          t.end(err);
        });
      t.end();
    });
  });
});
function addFaceBookUserTest(t, facebookId) {
  const expected = {
    type: USER_TYPE.FACEBOOK,
    facebookId: facebookId,
    idxKey: `${ENTITY.USER}-${STATE.ALIVE}-${ENTITY.FACEBOOK}-${facebookId}`
  };

  let savedUser;
  let savedIdxKey;
  let savedIdxValue;
  testDB.createReadStream({
    start: `${ENTITY.USER}-\x00`,
    end: `${ENTITY.USER}-\xFF`
  }).on('data', (data) => {
    if (data.key.startsWith('user-0-')) {
      savedIdxKey = data.key;
      savedIdxValue = data.value;
      return;
    }
    savedUser = data.value;
  }).on('error', (err) => {
    t.fail('Error while read Facebook User from DB');
    t.end(err);
  }).on('close', () => {
    t.equal(savedUser.type, expected.type, 'should have same user type facebook');
    t.equal(savedUser.facebookId, expected.facebookId, 'should have same facebook id');
    t.equal(savedUser.key, savedIdxValue.key, 'should have same user key');
    t.equal(savedIdxKey, expected.idxKey, 'should have same user idx key');
    t.end();
  });
}
test('add Facebook user', t => {
  const testFacebookId = process.env.FACEBOOK_TEST_ID || config.FACEBOOK_TEST_ID;
  clearDB()
    .then(FacebookManager.getTestAccessToken)
    .then(mockFacebookToken => {
      const mockFacebookUser = {
        facebookToken: mockFacebookToken
      };
      return UserModel.addFacebookUser(mockFacebookUser);
    })
    .then(() => addFaceBookUserTest(t, testFacebookId));
});
test('add duplicate Facebook user', t => {
  const testFacebookId = process.env.FACEBOOK_TEST_ID || config.FACEBOOK_TEST_ID;
  let mockFacebookUser;
  clearDB()
    .then(FacebookManager.getTestAccessToken)
    .then(mockFacebookToken => {
      mockFacebookUser = {
        facebookToken: mockFacebookToken
      };
      return UserModel.addFacebookUser(mockFacebookUser);
    })
    .then(() => UserModel.addFacebookUser(mockFacebookUser))
    .then(() => addFaceBookUserTest(t, testFacebookId));
});
test('add created post(CreatedPostManager.addPost)', t => {
  const testObject = mockImages[0].value;
  const timeHash = KeyUtils.genTimeHash(new Date());
  const post = {
    entity: ENTITY.IMAGE,
    itemKey: testObject.itemKey,
    imageKey: testObject.key
  };
  CreatedPostManager.addPost(testObject.userKey, post, timeHash)
  .then((key)=>{
    return new Promise((resolve, reject) => {
      testDB.get(key, (err, item) => {
        return (err) ? reject(err) : resolve(item);
      });
    });
  }).then((item)=>{
    t.equal(item.itemKey, testObject.itemKey, 'should be same itemKey');
    t.equal(item.imageKey, testObject.key, 'should be same imageKey');
    t.end();
  }).catch((err)=>{
    t.fail(err);
    t.end();
  });
});
test('add saved posts with user key', t => {
  SavedPostManager.addPost(mockItem.userKey, mockItem.key)
  .then((key) => {
    return new Promise((resolve, reject) => {
      if (typeof key !== 'string' || !key.includes(mockItem.userKey)) {
        t.fail(`key is wrong: ${key}`);
        t.end();
        return;
      }
      testDB.get(key, (err, value) => {
        return (err) ? reject(err) : resolve(value);
      });
    });
  }).then((value) => {
    t.equal(value.key, mockItem.key, 'should be same key');
    t.end();
  }).catch((err)=>{
    t.fail();
    t.end(err);
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
      return (post.key.includes(testUser.key)) ? true : false;
    }).length
  };
  UserManager.getPostKeys(ENTITY.CREATED_POST, testUser.key)
  .then((values) => {
    t.equal(values.length, expected.length,
      `should be same number of size : ${values.length}`);
    t.end();
  }).catch((err) => {
    t.fail();
    t.end(err);
    return;
  });
});
test('get saved posts of a user(SavedPostManager.getPosts)', t => {
  const testUser = mockUsers[0].value;
  const expected = {
    userKey: testUser.key,
    // get a number of savedposts of test user
    length: mockSavedPosts.filter((post)=>{
      const prefix = `${ENTITY.SAVED_POST}-${STATE.ALIVE}-${testUser.key}`;
      return (post.key.startsWith(prefix));
    }).length
  };
  clearDB().then(initMock)
  .then(()=>{
    return new Promise((resolve, reject) => {
      SavedPostManager.getPosts(testUser.key, (err, posts) => {
        return (err) ? reject(err) : resolve(posts);
      });
    });
  }).then((posts) => {
    t.equal(posts.length, expected.length,
    `should ba same length of posts array : ${posts.length}`);
    posts.map((post) => {
      if (post.userKey !== expected.userKey) {
        t.fail(`wrong user key : ${post.userKey}`);
        return;
      }
      if (post.state === STATE.REMOVED) {
        t.fail('removed item should not return');
        return;
      }
      t.notEqual(post.imageUrls.length, 0,
      `valid length of image url : ${post.imageUrls.length}`);
    });
    t.end();
  }).catch((err) => {
    t.fail();
    t.end(err);
  });
});
test('get created posts of a user(CreatedPostManager.getPosts)', t => {
  const testUser = mockUsers[0].value;
  const expected = {
    userKey: testUser.key,
    length: CREATED_POSTS_LENGTH_OF_TEST_USER,
    // states: [ 'alive', 'expired' ]
    states: [
      STATE_STRING[STATE.ALIVE],
      STATE_STRING[STATE.EXPIRED]
    ]
  };
  clearDB().then(initMock)
  .then(()=>{
    return new Promise((resolve, reject) => {
      CreatedPostManager.getPosts(testUser.key, (err, posts) => {
        return (err) ? reject(err) : resolve(posts);
      });
    });
  }).then((posts)=>{
    t.equal(posts.length, expected.length,
    `should ba same length of posts array : ${posts.length}`);
    posts.map((post) => {
      if (!post.images) {
        t.comment('there is no images Field');
        t.fail();
      }
      if (!post.images.length) {
        t.comment('no image in this item');
        t.fail();
      }
      if (expected.states.indexOf(post.state) === -1) {
        t.comment(`invalid state : ${post.state}`);
        t.fail();
      }
      if (post.userKey !== expected.userKey) {
        t.comment(`invalid userKey : ${post.userKey}`);
        t.fail();
      }
    });
    t.end();
  }).catch((err) => {
    t.fail();
    t.end(err);
  });
});
test('get created post using key set(CreatedPostManager.fetchPost)', t => {
  const testObj = {
    isCreatedByUser: false,
    itemKey: mockItems[0].key,
    imageKeys: [mockImages[0].key]
  };
  const expected = {
    itemValue: mockItems[0].value
  };
  CreatedPostManager.fetchPost(testObj).then((post)=>{
    t.equal(post.key, expected.itemValue.key, 'should be same item key');
    t.equal(post.userKey, expected.itemValue.userKey, 'should be same user key');
    t.equal(post.hasOwnProperty('isCreatedByUser'), true, 'should have isCreatedByUser field');
    t.equal(post.hasOwnProperty('images'), true, 'should have images field');
    t.equal(post.images[0].hasOwnProperty('imageKey'), true, 'should have imageKey field');
    t.equal(post.images[0].hasOwnProperty('imageUrl'), true, 'should have imageUrl field');
    t.end();
  });
});
test('delete saved post(SavedPostManager.deletePost)', t => {
  const testUser = mockUsers[0].value;
  const testItem = mockItems[0].value;
  const expected = {
    value: mockSavedPosts[0].value,
    length: mockSavedPosts.length - 1
  };
  clearDB().then(initMock)
  .then(() => {
    return SavedPostManager.deletePost(testUser.key, testItem.key);
  }).then(() => {
    fetchPrefix(`${ENTITY.SAVED_POST}-`, (err, values) => {
      if (err) {
        t.fail('fetchPrefix error');
        t.end();
        return;
      }
      t.equal(values.length, expected.length, 'should be same length');
      t.end();
    });
  }).catch((err) => {
    t.fail();
    t.end(err);
  });
});
test('generate a createdPost key(CreatedPostManager.genKey)', t => {
  const testBody = {
    userKey: mockItem.userKey,
    entitiyKey: mockItem.key,
    state: STATE.ALIVE
  };
  // Key rule : createdPost-{STATE}-{USER_KEY}-{TIMEHASH}
  const expectedKey = `${ENTITY.CREATED_POST}-${testBody.state}-`
  + `${testBody.userKey}-${KeyUtils.parseTimeHash(testBody.entitiyKey)}`;
  const key = CreatedPostManager.genKey(testBody.userKey, testBody.entitiyKey, testBody.state);
  t.equal(key, expectedKey, 'should be same Key');
  t.end();
});
test('delete created post(CreatedPostManager.deletePost)', t => {
  const testPost = mockCreatedPosts[0];
  clearDB().then(initMock)
  .then(() => {
    return CreatedPostManager.deletePost(testPost.key);
  })
  // deletePost function return new key. e.g. createdPost-2-user-....
  .then(getPromise)
  .then((value) => {
    t.deepEqual(value, testPost.value, 'should be same value');
    t.end();
  })
  .catch((err) => {
    t.fail();
    t.end(err);
  });
});
test('fetchUserProfiles()', t => {
  const testObjs = mockUsers.map(user => ({userKey: user.key}));
  clearDB().then(initMock).then(() => {
    UserManager.fetchUserProfiles(testObjs).then(fetchedVals => {
      t.equal(fetchedVals.length, testObjs.length, 'should be same length');
      fetchedVals.map((value, idx) => {
        t.equal(testObjs[idx].userKey, value.user.key, 'should be same key');
        t.ok(value.user, 'has own user property');
      });
      t.end();
    });
  }).catch(err => {
    t.fail();
    t.end(err);
  });
});
