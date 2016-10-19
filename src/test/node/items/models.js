import test from 'tape';
import testDB from '../../../server/database';
import {KeyUtils, ENTITY, STATE, DEFAULT_PRECISON} from '../../../server/key-utils';
import {ItemManager} from '/src/server/items/model';
test('remove indexing items', t => {
  const testItem = {
    'item-8523910540005-b82e-473b-1234-ead0f190b000': {
      title: 'Lion popup store',
      lat: 37.756787937,
      lng: -122.4233365122,
      address: '310 Dolores St, San Francisco, CA 94110, USA',
      createdDate: '2016-10-13T01:11:46.851Z',
      modifiedDate: '2016-10-13T01:11:46.851Z',
      category: 'event',
      startTime: '2016-10-13T01:11:46.851Z',
      endTime: '2016-10-15T01:11:46.851Z',
      key: 'item-8523910540005-b82e-473b-1234-ead0f190b000',
      userKey: 'user-8523574664000-b82e-473b-1234-ead0f54gvr00'
    }
  };
  const expected = {
    numberOfIdxItems: DEFAULT_PRECISON,
    statusAfter: STATE.REMOVED
  };
  const timeHash = KeyUtils.getTimeHash(testItem.key);
  const idxItems = [];
  new Promise((resolve, reject) => {
    ItemManager.removeIdxItems(testItem, (err) => {
      return (err) ? reject(err) : resolve();
    });
  })
  .then(()=>{
    let error;
    testDB.createReadStream({
      start: `${ENTITY.ITEM}-\x00`,
      end: `${ENTITY.ITEM}-\xFF`
    }).on('data', (data) => {
      if (KeyUtils.getTimeHash(data.key) === timeHash && !KeyUtils.isOriginKey(data.key)) {
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
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable */
  });
});
