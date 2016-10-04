import test from 'tape';
import ItemController from '../../../server/items/controllers';
import httpMocks from 'node-mocks-http';
import testDB, {clearDB} from '../../../server/database';
import uuid from 'uuid4';

const itemRedSelo = {
  description: 'This is Red Selo',
  lat: 30.565398,
  lng: 126.9907941,
  address: 'Red Selo',
  createdDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
  modifiedDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
  category: 'warning'
};
const itemAlaska = {
  description: 'This is Alaska',
  lat: 37.565398,
  lng: 126.9907941,
  address: 'Alaska',
  createdDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
  modifiedDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
  category: 'warning'
};
test('get all items from database', t => {
  let key1 = `item-${uuid()}`;
  let key2 = `item-${uuid()}`;

  // https://github.com/Level/levelup#introduction
  // LevelDB stores entries sorted lexicographically by keys.
  if (key2 < key1) {
    const temp = key2;
    key2 = key1;
    key1 = temp;
  }

  const expected = {
    status: 200,
    items: [
      itemRedSelo,
      itemAlaska
    ]
  };
  testDB.createReadStream({
    start: 'item-',
    end: 'item-\xFF'
  }).on('data', (data) => {
    testDB.del(data.key, (err) => {
      if (err) {
        t.fail('database fault');
      }
    });
  }).on('close', () => {
    testDB.batch()
      .put(key1, itemRedSelo)
      .put(key2, itemAlaska)
      .write((err) => {
        if (err) {
          t.end(err);
        }
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        ItemController.getAll(req, res, () => {
          const data = res._getData();
          t.equal(res.statusCode, expected.status,
            'should be same status');
          t.equal(data.items.length, 2,
            'should be same length');
          t.equal(data.items[0].description, expected.items[0].description,
            'should be same description');
          t.equal(data.items[1].description, expected.items[1].description,
            'should be same description');
          testDB.batch()
            .del(key1)
            .del(key2)
            .write((delErr) => {
              if (delErr) {
                t.end(delErr);
              }
              t.end();
            });
        });
      });
  });
});
test('get a item from database', t => {
  const key = `item-${uuid()}`;
  testDB.put(key, itemRedSelo, (err) => {
    if (err) {
      t.end(err);
    }
  });

  const expected = itemRedSelo;
  expected.status = 200;
  const req = httpMocks.createRequest({
    method: 'GET',
    url: `/items/${key}`,
    params: {
      id: `${key}`
    }
  });

  const res = httpMocks.createResponse();

  ItemController.getById(req, res, () => {
    const data = res._getData();
    t.equal(res.statusCode, expected.status,
      'should be same status');
    t.equal(data.description, expected.description,
      'should be same description');
    testDB.del(`${key}`, (err) => {
      if (err) {
        t.end(err);
      }
      t.end();
    });
  });
});
test('add an item to database', t => {
  const expected = {
    status: 200,
    message: 'success',
    indexingItemCnt: 8,
    geohash: 'wv6mcsrb'
  };

  const req = httpMocks.createRequest({
    method: 'POST',
    url: '/items',
    body: itemRedSelo
  });

  clearDB(()=>{
    const res = httpMocks.createResponse();
    ItemController.add(req, res, () => {
      const status = res.statusCode;
      const message = res._getData().message;
      const itemId = res._getData().data;
      //  Compare status, message of respone.
      t.equal(status, expected.status, 'should be same status');
      t.equal(message, expected.message, 'should be same message');
      const indexingItems = [];
      let postedItem;
      let error;
      //  Get all items
      testDB.createReadStream({
        start: '0',
        end: '\xFF'
      }).on('data', (data) => {
        data.value.id = data.key;
        //  Cases of indexing items.
        if (data.value.ref) {
          const indexingItemCnt = indexingItems.length;
          t.equal(data.value.ref, itemId
          , `should be same id[${indexingItemCnt}]`);
          const dataGeohash = data.value.id.split('-')[2];
          //  Compare indexing item's geohash.
          t.equal(dataGeohash, expected.geohash.substr(0, indexingItemCnt + 1)
          , `should be same indexing geohash[${indexingItemCnt}]`);
          indexingItems.push(data.value);
        } else {
          postedItem = data.value;
        }
      }).on('error', (err) => {
        error = err;
        t.end(error);
      }).on('close', () => {
        if (!error) {
          t.equal(indexingItems.length, expected.indexingItemCnt,
          'should be same indexing item counts');
          t.equal(postedItem.id.split('-')[1], expected.geohash, 
          'should be same geohash');
          t.end();
        } else {
          t.end(error);
        }
      });
    });
  });
});
test('modify an item in database', t => {
  const key = `item-${uuid()}`;
  const ops = [
    { type: 'put', key: key, value: itemRedSelo }
  ];

  testDB.batch(ops, (err) => {
    if (err) {
      t.end(err);
    }

    const itemModified = itemAlaska;
    itemModified.address = 'Alaska Modified';

    const expected = {
      status: 200,
      message: 'success',
      modifiedAddr: itemModified.address
    };

    const req = httpMocks.createRequest({
      method: 'PUT',
      url: '/items/' + key,
      params: {
        id: key
      },
      body: itemModified
    });

    const res = httpMocks.createResponse();

    ItemController.modify(req, res, () => {
      const status = res.statusCode;
      const message = res._getData().message;
      const modifiedAddr = res._getData().data.address;
      t.equal(status, expected.status,
        'should be same status');
      t.equal(message, expected.message,
        'should be same message');
      t.equal(modifiedAddr, expected.modifiedAddr,
        'should be same address');
      t.end();
    });
  });
});
test('delete an item from database', t => {
  const key = `item-${uuid()}`;
  const ops = [
    { type: 'put', key: key, value: itemRedSelo }
  ];

  testDB.batch(ops, (err) => {
    if (err) {
      t.end(err);
    }

    const expected = {
      status: 200,
      message: 'success'
    };

    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: `/items/${key}`,
      params: {
        id: key
      }
    });

    const res = httpMocks.createResponse();

    ItemController.remove(req, res, () => {
      const status = res.statusCode;
      const message = res._getData().message;
      t.equal(status, expected.status,
        'should be same status');
      t.equal(message, expected.message,
        'should be same message');
      t.end();
    });
  });
});
test('delete all item from database', t => {
  const redSeloKey = `item-${uuid()}`;
  const alaskaKey = `item-${uuid()}`;
  const ops = [
    { type: 'put', key: redSeloKey, value: itemRedSelo },
    { type: 'put', key: alaskaKey, value: itemAlaska }
  ];

  testDB.batch(ops, (err) => {
    if (err) {
      t.end(err);
    }

    const expected = {
      status: 200,
      message: 'success'
    };

    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: '/items'
    });

    const res = httpMocks.createResponse();

    ItemController.removeAll(req, res, () => {
      const status = res.statusCode;
      const message = res._getData().message;
      testDB.get(redSeloKey, (err1) => {
        if (err1 && err1.notFound) {
          testDB.get(alaskaKey, (err2) => {
            if (err2 && err2.notFound) {
              t.equal(status, expected.status,
                'should be same status');
              t.equal(message, expected.message,
                'should be same message');
              t.end();
              return;
            }
            t.fail('alaska is not removed');
            t.end();
          });
          return;
        }
        t.fail('redSelo is not removed');
        t.end();
      });
    });
  });
});
