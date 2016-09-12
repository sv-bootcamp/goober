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
  const ops = [
    { type: 'put', key: 'item1', value: itemRedSelo },
    { type: 'put', key: 'item2', value: itemAlaska }
  ];

  testDB.batch(ops, (err) => {
    if (err) {
      t.end(err);
    }

    const expected = {
      itemRedSelo,
      itemAlaska
    };

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    ItemController.getAll(req, res, () => {
      const data = res._getData();
      t.equal(data.items[0].description, expected.itemRedSelo.description,
        'should be same description');
      t.equal(data.items[1].description, expected.itemAlaska.description,
        'should be same description');

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
test('get a item from database', t => {
  testDB.put('item1', itemRedSelo, (err) => {
    if (err) {
      t.end(err);
    }
  });

  const expected = itemRedSelo;

  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/items/1',
    params: {
      id: 1
    }
  });

  const res = httpMocks.createResponse();

  ItemController.getById(req, res, () => {
    const data = res._getData();
    t.equal(data.description, expected.description, 'should be same description');
    t.end();
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
