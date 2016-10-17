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
  caption: 'this is image A'
};
// const MockImageB = {
//   caption: 'this is image B'
// };

test('get all image of an item', t => {
  const itemKey = 'item-BlaBla';
  const imageIndexKey = `image-${STATE.ALIVE}-${itemKey}-imageA-unique-id`;
  const expectedLength = 1;

  clearDB((errClear) => {
    if (errClear) {
      t.fail(errClear);
      t.end();
      return;
    }
    const opts = [];
    opts.push({
      type: 'put',
      key: imageIndexKey,
      value: {
        key: 'image-origin-key'
      }
    });
    opts.push({
      type: 'put',
      key: 'image-origin-key',
      value: {
        createdDate: new Date().toISOString(),
        userKey: 'user1',
        caption: MockImageA.caption
      }
    });

    testDB.batch(opts, (err) => {
      if (err) {
        t.fail('database batch error');
        t.end();
        return;
      }
      const req = httpMocks.createRequest({
        method: 'GET',
        url: `/images?itemid=${itemKey}`,
        query: {
          itemid: itemKey
        }
      });
      const res = httpMocks.createResponse();

      controller.get(req, res, () => {
        const imageUrls = res._getData().imageUrls;
        t.equal(imageUrls.length, expectedLength, 'should be same key');
        t.end();
      });
    });
  });
});
