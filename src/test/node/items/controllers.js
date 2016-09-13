import test from 'tape';
import ItemController from '../../../server/items/controllers';
import httpMocks from 'node-mocks-http';
import testDB from '../../../server/database';
import uuid from 'uuid4';

const itemRedSelo = {
  description: 'This is Red Selo',
  lat: 30.565398,
  lng: 126.9907941,
  address: 'Red Selo',
  createdDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
  modifiedDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
  category: 'default'
};
const itemAlaska = {
  description: 'This is Alaska',
  lat: 37.565398,
  lng: 126.9907941,
  address: 'Alaska',
  createdDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
  modifiedDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
  category: 'default'
};

test('get all items from database', t => {
  const key1 = `item-${uuid()}`;
  const key2 = `item-${uuid()}`;
  const expected = {
    status: 200,
    key1: itemRedSelo,
    key2: itemAlaska
  };
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
        t.equal(Object.keys(data).length, 2,
          'should be same length');
        t.equal(data[key1].description, expected.key1.description,
          'should be same description');
        t.equal(data[key2].description, expected.key2.description,
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

test('delete an item from database', t => {
  const ops = [
    { type: 'put', key: 'item1', value: itemRedSelo }
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
      url: '/items/1',
      params: {
        id: 1
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
  const ops = [
    { type: 'put', key: 'item1', value: itemRedSelo },
    { type: 'put', key: 'item2', value: itemAlaska }
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
      testDB.get('item1', (err1) => {
        if (err1 && err1.notFound) {
          testDB.get('item2', (err2) => {
            if (err2 && err2.notFound) {
              t.equal(status, expected.status,
                'should be same status');
              t.equal(message, expected.message,
                'should be same message');
              t.end();
              return;
            }
            t.fail('item2 is not removed');
            t.end();
          });
          return;
        }
        t.fail('item1 is not removed');
        t.end();
      });
    });
  });
});
