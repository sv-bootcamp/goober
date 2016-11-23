import test from 'tape';
import testDB, {initMock, clearDB} from '../../../server/database';
import {expiredItem} from '../../../server/database-mock-data';
import ItemManager, {STATE_STRING} from '../../../server/items/models';
import {KeyUtils, ENTITY, STATE, DEFAULT_PRECISON, CATEGORY} from '../../../server/key-utils';

const testItem = {
  title: 'Lion popup store',
  lat: 37.756787937,
  lng: -122.4233365122,
  address: '310 Dolores St, San Francisco, CA 94110, USA',
  createdDate: '2016-10-13T01:11:46.851Z',
  modifiedDate: '2016-10-13T01:11:46.851Z',
  category: CATEGORY.EVENT,
  startTime: '2016-10-13T01:11:46.851Z',
  endTime: '2016-10-15T01:11:46.851Z',
  state: STATE_STRING[STATE.ALIVE],
  key: 'item-8523910540005-dddddddd-dddd-473b-1234-ead0f190b000',
  userKey: 'user-8523574664000-zzzzzzzz-b82e-473b-1234-ead0f54gvr00',
  image: 'aaaaaa'
};
test('validate expired date', t => {
  const expiredDate = '1999-01-01T01:11:00.851Z';
  const vaildDate = new Date().setDate(new Date().getDate() + 1);
  const noLimit = '';
  const expected = {
    expiredDate: false,
    vaildDate: true,
    noLimit: true
  };
  t.equal(ItemManager.isValid(expiredDate), expected.expiredDate, 'False when it is expired');
  t.equal(ItemManager.isValid(vaildDate), expected.vaildDate, 'True when it is valid');
  t.equal(ItemManager.isValid(noLimit), expected.noLimit, 'True when it is no-limit');
  t.end();
});
test('remove indexing items', t => {
  const expected = {
    numberOfIdxItems: DEFAULT_PRECISON,
    stateAfter: STATE.REMOVED,
    stateString: STATE_STRING[STATE.REMOVED]
  };
  const timeHash = KeyUtils.parseTimeHash(testItem.key);
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
        if (KeyUtils.parseState(data.key) !== expected.stateAfter) {
          t.fail(`This key's staus is wrong : ${data.key}(expeted:${expected.stateAfter})`);
          t.end();
        }
        idxItems.push(data.value);
      } else if (data.key.includes(timeHash) && KeyUtils.isOriginKey(data.key)) {
        t.equal(data.value.state, expected.stateString,
         `should be same state : ${expected.stateString}`);
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
    numberOfIdxItems: DEFAULT_PRECISON,
    stateString: STATE_STRING[STATE.EXPIRED]
  };
  const timeHash = KeyUtils.parseTimeHash(expiredItem.key);
  let itemCnt = 0;
  clearDB().then(initMock).then(()=>{
    return new Promise((resolve) => {
      ItemManager.validChecker(expiredItem.value, (result)=>{
        t.equal(result, expected.result, 'should be same result');
        resolve();
      });
    });
  })
  .then(()=>{
    /* eslint-disable max-len */
    /*
      validChecker function implements changing state code of indexing item asynchronously if it's invalid.
      this implementation is runned after callback to prevent perfomance issue in item get API so needs delay for test
    */
    /* eslint-enable */
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
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
        // in case of indexing keys
        if (data.key.includes(timeHash) && !KeyUtils.isOriginKey(data.key)) {
          if (KeyUtils.parseState(data.key) !== STATE.EXPIRED) {
            t.fail(`This key's staus is wrong : ${data.key}(expeted:${STATE.EXPIRED}`);
            t.end();
          }
          changedItemsCnt = changedItemsCnt + 1;
        // in case of original key
        } else if (data.key.includes(timeHash) && KeyUtils.isOriginKey(data.key)) {
          t.equal(data.value.state, expected.stateString,
          `should be same state : ${expected.stateString}`);
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
