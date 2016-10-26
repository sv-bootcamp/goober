import test from 'tape';
import testDB, {initMock, clearDB} from '../../../server/database';
import {KeyUtils, ENTITY, STATE, DEFAULT_PRECISON} from '../../../server/key-utils';
import ItemManager from '../../../server/items/models';
import {mockItems, expiredItemKey} from '../../../server/database-mock-data';

const testItem = {
  title: 'Lion popup store',
  lat: 37.756787937,
  lng: -122.4233365122,
  address: '310 Dolores St, San Francisco, CA 94110, USA',
  createdDate: '2016-10-13T01:11:46.851Z',
  modifiedDate: '2016-10-13T01:11:46.851Z',
  category: 'event',
  startTime: '2016-10-13T01:11:46.851Z',
  endTime: '2016-10-15T01:11:46.851Z',
  key: 'item-8523910540005-edddd-473b-1234-ead0f190b000',
  userKey: 'user-8523574664000-b82e-473b-1234-ead0f54gvr00',
  image: 'aaaaaa'
};
test('validate expired date', t => {
  const expiredDate = '1999-01-01T01:11:00.851Z';
  const vaildDate = new Date().setDate(new Date().getDate() + 1);
  const expected = {
    results: {
      expiredDate: false,
      vaildDate: true
    }
  };
  t.equal(ItemManager.isValid(expiredDate), expected.results.expiredDate,
    'False when it is expired');
  t.equal(ItemManager.isValid(vaildDate), expected.results.vaildDate, 'True when it is valid');
  t.end();
});
test('remove indexing items', t => {
  const expected = {
    numberOfIdxItems: DEFAULT_PRECISON,
    statusAfter: STATE.REMOVED
  };
  const timeHash = KeyUtils.getTimeHash(testItem.key);
  const idxItems = [];
  new Promise((resolve, reject) => {
    ItemManager.changeState(testItem, STATE.REMOVED, (err) => {
      return (err) ? reject(err) : resolve();
    });
  })
  .then(()=>{
    let error;
    testDB.createReadStream({
      start: `${ENTITY.ITEM}-\x00`,
      end: `${ENTITY.ITEM}-\xFF`
    }).on('data', (data) => {
      if (data.key.includes(timeHash) && !KeyUtils.isOriginKey(data.key)) {
        if (KeyUtils.parseState(data.key) !== expected.statusAfter) {
          t.fail(`This key's staus is wrong : ${data.key}(expeted:${expected.statusAfter})`);
          t.end();
        }
        idxItems.push(data.value);
      }
    }).on('error', (err) => {
      error = err;
    }).on('close', () => {
      if (error) {
        t.fail('database error');
        t.end();
        return;
      }
      t.pass('all item keys are changed successfully');
      t.equal(idxItems.length, expected.numberOfIdxItems,
      'should be same number of indexing items');
      t.end();
    });
  })
  .catch((err)=>{
    t.fail('Error while reading from DB');
    t.end(err);
  });
});
test('Check endTime value and change indexing items', t => {
  const expected = {
    result: false,
    numberOfIdxItems: DEFAULT_PRECISON
  };
  const expiredItem = mockItems[expiredItemKey];
  const timeHash = KeyUtils.getTimeHash(expiredItemKey);
  let itemCnt = 0;
  clearDB().then(initMock).then(()=>{
    return new Promise((resolve) => {
      ItemManager.validChecker(expiredItem, (result)=>{
        t.equal(result, expected.result, 'should be same result');
        resolve();
      });
    });
  })
  .then(()=>{
    return new Promise((resolve, reject) => {
      let error;
      let changedItemsCnt = 0;
      testDB.createReadStream({
        start: `${ENTITY.ITEM}-`,
        end: `${ENTITY.ITEM}-\xFF`
      }).on('data', (data) => {
        itemCnt = itemCnt + 1;
        if (data.key.includes(timeHash) && !KeyUtils.isOriginKey(data.key)) {
          if (KeyUtils.parseState(data.key) !== STATE.EXPIRED) {
            t.fail(`This key's staus is wrong : ${data.key}(expeted:${STATE.EXPIRED}`);
            t.end();
          }
          changedItemsCnt = changedItemsCnt + 1;
        }
        return;
      }).on('error', (err) => {
        error = err;
      }).on('close', () => {
        return (error) ? reject(error) : resolve(changedItemsCnt);
      });
    });
  })
  .then((changedItemsCnt)=>{
    t.equal(changedItemsCnt, expected.numberOfIdxItems,
     `should be same number of indexing items (all item conunt : ${itemCnt})`);
    t.pass('all item keys are changed successfully');
    t.end();
  })
  .catch((err)=>{
    t.fail('Error while reading from DB');
    t.end(err);
  });
});
