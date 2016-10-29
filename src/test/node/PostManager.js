import test from 'tape';
import testDB from '../../server/database';
import {KeyUtils, ENTITY} from '../../server/key-utils';
import PostManager from '../../server/PostManager';

export const mockItem = {
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
test('add created posts with user key', t => {
  const timeHash = KeyUtils.genTimeHash(new Date());
  new Promise((resolve, reject) => {
    PostManager.addCreatedPost(ENTITY.ITEM, mockItem.key, mockItem.userKey, timeHash, (err, key)=>{
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
    PostManager.addSavedPost(mockItem.key, mockItem.userKey, timeHash, (err, key)=>{
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