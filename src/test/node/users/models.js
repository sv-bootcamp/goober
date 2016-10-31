import test from 'tape';
import testDB, {initMock, clearDB} from '../../../server/database';
import {KeyUtils, ENTITY} from '../../../server/key-utils';
import UserManager, {CreatedPostManager, SavedPostManager} from '../../../server/users/models';

const mockItem = {
  title: 'mock item',
  lat: 37.765432,
  lng: -122.43210,
  address: 'address of mock item',
  createdDate: '2016-10-10T01:11:46.851Z',
  modifiedDate: '2016-10-10T01:11:46.851Z',
  category: 'warning',
  startTime: '2016-10-10T01:11:46.851Z',
  endTime: '2017-01-01T10:10:10.851Z',
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
