import test from 'tape';
import ItemController from '../../../server/items/controllers';
import httpMocks from 'node-mocks-http';
import geohash from 'ngeohash';
import testDB, {clearDB} from '../../../server/database';
import {DEFAULT_PRECISON, STATUS_CODE_POS, ALIVE,
        REMOVED, MAX_TIME} from '../../../server/items/models';
import uuid from 'uuid4';

const itemRedSelo = {
  description: 'This is Red Selo',
  lat: 30.565398,
  lng: 126.9907941,
  address: 'Red Selo',
  category: 'warning'
};
const itemAlaska = {
  description: 'This is Alaska',
  lat: 37.565398,
  lng: 126.9907941,
  address: 'Alaska',
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
test('get by area from database', t => {
  const centerGeohash = 'wv6mcsr';
  const neighbors = geohash.neighbors(centerGeohash);
  const reversedTime = MAX_TIME - Number(new Date());
  const expected = {
    status: 200,
    message: 'success',
    items: [
      { id: `item-${ALIVE}-${centerGeohash}-${reversedTime}`},
      { id: `item-${ALIVE}-${neighbors[0]}-${reversedTime}`},
      { id: `item-${ALIVE}-${neighbors[1]}-${reversedTime}`},
      { id: `item-${ALIVE}-${neighbors[2]}-${reversedTime}`},
      { id: `item-${ALIVE}-${neighbors[3]}-${reversedTime}`},
      { id: `item-${ALIVE}-${neighbors[4]}-${reversedTime}`},
      { id: `item-${ALIVE}-${neighbors[5]}-${reversedTime}`},
      { id: `item-${ALIVE}-${neighbors[6]}-${reversedTime}`},
      { id: `item-${ALIVE}-${neighbors[7]}-${reversedTime}`}
    ]
  };
  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/items?is_area_search=true&lat=30.565398&lng=126.9907941&zoom=21'
  });
  const res = httpMocks.createResponse();
  clearDB(() => {
    const ops = [];
    for (let i = 0; i < expected.items.length; i = i + 1) {
      const tempValue = JSON.parse(JSON.stringify(itemRedSelo));
      tempValue.ref = expected.items[i].id;
      ops.push({ type: 'put', key: expected.items[i].id, value: tempValue });
    }
    
    testDB.batch(ops, (err) => {
      if (err) {
        t.end(err);
      }
      ItemController.getAll(req, res, () => {
        t.equal(res.statusCode, expected.status, 'should be same status');
        const items = res._getData().items.sort((a, b) => {
          return a.id > b.id;
        });
        expected.items = expected.items.sort((a, b) => {
          return a.id > b.id;
        });
        for (let j = 0; j < items.length; j += 1) {
          t.equal(items[j].id, expected.items[j].id, 'should be same id');
        }
        t.end();
      });
    });  
  });
});
test('add an item to database', t => {
  const geo = geohash.encode(itemRedSelo.lat, itemRedSelo.lng, DEFAULT_PRECISON);
  const expected = {
    status: 200,
    message: 'success',
    keys: [
      `item-${geo}-`,
      `item-${ALIVE}-${geo.substring(0, 1)}-`,
      `item-${ALIVE}-${geo.substring(0, 2)}-`,
      `item-${ALIVE}-${geo.substring(0, 3)}-`,
      `item-${ALIVE}-${geo.substring(0, 4)}-`,
      `item-${ALIVE}-${geo.substring(0, 5)}-`,
      `item-${ALIVE}-${geo.substring(0, 6)}-`,
      `item-${ALIVE}-${geo.substring(0, 7)}-`,
      `item-${ALIVE}-${geo}-`
    ],
    address: itemRedSelo.address
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
      const key = res._getData().data;
      t.equal(status, expected.status, 'should be same status');
      t.equal(message, expected.message, 'should be same message');

      let error;
      let refs = [];
      let ref;

      testDB.createReadStream({
        start: '\x00',
        end: '\xFF'
      }).on('data', (data) => {
        if (!data.value.ref) {
          t.equal(key, data.key,
            'should have same key');
          t.equal(true, data.key.includes(expected.keys[0]),
            'should have same key prefix');
          t.equal(expected.address, data.value.address,
            'should be same address');
          ref = data.key;
          return;
        }
        let exist = false;
        for (let i = 1; i <= DEFAULT_PRECISON; i = i + 1) {
          if (data.key.includes(expected.keys[i])) {
            exist = true;
          }
        }
        t.equal(true, exist, 'should have same key prefix');
        refs.push(data.value.ref);
      }).on('error', (err) => {
        error = err;
      }).on('close', () => {
        if (error) {
          t.fail('database error');
          t.end();
          return;
        }
        for (let i = 0; i < DEFAULT_PRECISON; i = i + 1) {
          if (refs[i] !== ref) {
            t.fail('should have same ref');
            break;
          }
        }
        t.end();
        return;
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
  const expected = {
    status: 200,
    message: 'success',
    itemCnt: 1,
    indexingItemCntBefore: DEFAULT_PRECISON,
    statusCodeBefore: ALIVE,
    statusCodeAfter: REMOVED
  };
  clearDB(()=>{
    const addReq = httpMocks.createRequest({
      method: 'POST',
      url: '/items',
      body: itemRedSelo
    });
    const addRes = httpMocks.createResponse();
    ItemController.add(addReq, addRes, () => {
      const key = addRes._getData().data;
      let indexingItemsCnt = 0;
      let itemCnt = 0;
      let error;
      let statusCode;
      testDB.createReadStream({
        start: '\x00',
        end: '\xFF'
      }).on('data', (data) => {
        if (data.value.ref === key) {
          indexingItemsCnt = indexingItemsCnt + 1;
          statusCode = data.key.charAt(STATUS_CODE_POS);
          t.equal(statusCode, expected.statusCodeBefore
          , `should be same status code[${indexingItemsCnt}]`);
        } else if (data.value.description === itemRedSelo.description) {
          itemCnt = itemCnt + 1;
        }
      }).on('error', (err) => {
        error = err;
        t.fail('Error while reading from DB');
        t.end(error);
      }).on('close', () => {
        if (error) {
          t.fail('Error while reading from DB');
          t.end(error);
        } else {
          t.equal(indexingItemsCnt, expected.indexingItemCntBefore,
          'should be same indexing item counts');
          t.equal(itemCnt, expected.itemCnt,
          'should be same item count before delete');
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
            t.equal(status, expected.status, 'should be same status');
            t.equal(message, expected.message, 'should be same message');
            itemCnt = 0;
            testDB.createReadStream({
              start: '\x00',
              end: '\xFF'
            }).on('data', (data) => {
              if (data.value.ref === key) {
                statusCode = data.key.charAt(STATUS_CODE_POS);
                t.equal(statusCode, expected.statusCodeAfter
            , 'should be same status code after delete');
              } else if (data.value.description === itemRedSelo.description) {
                itemCnt = itemCnt + 1;
              }
            }).on('error', (err) => {
              error = err;
              t.fail('Error while reading from DB');
              t.end(error);
            }).on('close', () => {
              if (!error) {
                t.equal(itemCnt, expected.itemCnt
                , 'should be same item counts after delete');
                t.end();
              } else {
                t.end(error);
              }
            });
          });
        }
      });
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
