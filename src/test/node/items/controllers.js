import test from 'tape';
import ItemController from '../../../server/items/controllers';
import httpMocks from 'node-mocks-http';
import testDB from '../../../server/database';

const item1 = {
  description: 'This is Red Selo',
  lat: 30.565398,
  lng: 126.9907941,
  address: 'Red Selo',
  createdDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
  modifiedDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
  category: 'default'
};
const item2 = {
  description: 'This is Alaska',
  lat: 37.565398,
  lng: 126.9907941,
  address: 'Alaska',
  createdDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
  modifiedDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
  category: 'default'
};

test('get all items from database', t => {
  let ops = [
    { type: 'put', key: 'item1', value: item1 },
    { type: 'put', key: 'item2', value: item2 }
  ];

  testDB.batch(ops, (err) => {
    if (err) {
      t.end(err);
    }

    const expected = {
      item1,
      item2
    };

    const res = httpMocks.createResponse();
    ItemController.getAll(res, () => {
      let data = res._getData();
      t.equal(data.item1.description, expected.item1.description, 'should be same description');
      t.equal(data.item2.description, expected.item2.description, 'should be same description');

      /*
      leveldown.destroy(dbPath, (errr) => {
        if(errr) { console.log('Ooops!', errr); }
        console.log('clear db');
      });
      */
      t.end();
    });
  });
});
