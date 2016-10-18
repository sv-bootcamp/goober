import test from 'tape';
import {STATE} from '../../../server/key-utils';
import testDB, {clearDB} from '../../../server/database';
import controller from '../../../server/images/controllers';
import httpMocks from 'node-mocks-http';

// const MockItem = {
//   title: 'This is Red Selo',
//   lat: 30.565398,
//   lng: 126.9907941,
//   address: 'Red Selo',
//   category: 'warning'
// };
const MockImageA = {
  key: 'image-8523306706662-c8a94c49-0c3c-414a-bec0-74fc369a105e',
  userKey: 'user-1234uuid',
  caption: 'thisissmaplecode.',
  createdDate: '2016-10-17T08:34:53.338Z'
};
// const MockImageB = {
//   caption: 'this is image B'
// };

test('get all image of an item', t => {
  const itemKey = 'item-BlaBla';
  const imageIndexKey = `image-${STATE.ALIVE}-${itemKey}-${MockImageA.key}`;

  clearDB().then(() => {
    const opts = [];
    opts.push({
      type: 'put',
      key: imageIndexKey,
      value: {
        key: MockImageA.key
      }
    });
    opts.push({
      type: 'put',
      key: MockImageA.key,
      value: MockImageA
    });

    testDB.batch(opts, (err) => {
      if (err) {
        t.fail('database batch error');
        t.end();
        return;
      }
      const req = httpMocks.createRequest({
        method: 'GET',
        url: `/images?item=${itemKey}`,
        query: {
          item: itemKey
        }
      });
      const res = httpMocks.createResponse();

      controller.get(req, res, () => {
        const value = res._getData().values;
        t.equal(value[0].caption, MockImageA.caption, 'should be same caption');
        t.equal(value[0].key, MockImageA.key, 'should be same key');
        t.equal(typeof (value[0].url), 'string', 'should be same type');
        t.end();
      });
    });
  });
});

test('get an image', t => {
  clearDB().then(() => {
    return new Promise((rs, rj)=>{
      testDB.put(MockImageA.key, MockImageA, (err) => {
        if (err) {
          return rj();
        }
        return rs();
      });
    });
  }).then(() => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: `/images?image=${MockImageA.key}`,
      query: {
        image: MockImageA.key
      }
    });
    const res = httpMocks.createResponse();
    controller.get(req, res, () => {
      const value = res._getData();
      t.equal(value.caption, MockImageA.caption, 'should be same caption');
      t.equal(value.key, MockImageA.key, 'should be same key');
      t.end();
    });
  }).catch(() => {
    t.fail();
    t.end();
  });
});
