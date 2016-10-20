import test from 'tape';
import ItemController from '../../../server/items/controllers';
import httpMocks from 'node-mocks-http';
import testDB, {initMock, clearDB} from '../../../server/database';
import {DEFAULT_PRECISON, KeyUtils, STATE, ENTITY}
        from '../../../server/key-utils';
import uuid from 'uuid4';
import {S3Utils} from '../../../server/aws-s3';

const itemRedSelo = {
  title: 'This is Red Selo',
  lat: 30.565398,
  lng: 126.9907941,
  address: 'Red Selo',
  category: 'warning',
  userKey: `user-${uuid()}`,
  caption: 'Sample image caption of itemRedSelo.',
  startTime: '2016-10-13T01:11:46.851Z',
  endTime: '2016-10-15T01:11:46.851Z'
};
const itemAlaska = {
  title: 'This is Alaska',
  lat: 37.565398,
  lng: 126.9907941,
  address: 'Alaska',
  category: 'warning'
};
const imageRedSelo = {
  caption: 'red-selo',
  userKey: 'user1'
};

// test('get all items from database', t => {
//   let key1 = `item-${uuid()}`;
//   let key2 = `item-${uuid()}`;

//   // https://github.com/Level/levelup#introduction
//   // LevelDB stores entries sorted lexicographically by keys.
//   if (key2 < key1) {
//     const temp = key2;
//     key2 = key1;
//     key1 = temp;
//   }

//   const expected = {
//     status: 200,
//     items: [
//       itemRedSelo,
//       itemAlaska
//     ]
//   };
//   testDB.createReadStream({
//     start: 'item-',
//     end: 'item-\xFF'
//   }).on('data', (data) => {
//     testDB.del(data.key, (err) => {
//       if (err) {
//         t.fail('database fault');
//       }
//     });
//   }).on('close', () => {
//     testDB.batch()
//       .put(key1, itemRedSelo)
//       .put(key2, itemAlaska)
//       .write((err) => {
//         if (err) {
//           t.end(err);
//         }
//         const req = httpMocks.createRequest();
//         const res = httpMocks.createResponse();
//         ItemController.getAll(req, res, () => {
//           const data = res._getData();
//           t.equal(res.statusCode, expected.status,
//             'should be same status');
//           t.equal(data.items[0].title, expected.items[0].title,
//             'should be same title');
//           t.equal(data.items[1].title, expected.items[1].title,
//             'should be same title');
//           testDB.batch()
//             .del(key1)
//             .del(key2)
//             .write((delErr) => {
//               if (delErr) {
//                 t.end(delErr);
//               }
//               t.end();
//             });
//         });
//       });
//   });
// });
test('get a item from database', t => {
  const itemKey = `${ENTITY.ITEM}-key`;
  const imageKey = `${ENTITY.IMAGE}-key`;
  const imageIndexKey = `${ENTITY.IMAGE}-${STATE.ALIVE}-${itemKey}-${imageKey}`;
  const expected = itemRedSelo;
  expected.imageUrls = ['url-image-redselo'];
  expected.statusCode = 200;

  clearDB().then(() => {
    return new Promise((resolve, reject)=>{
      const opts = [];
      opts.push({type: 'put', key: itemKey, value: itemRedSelo});
      opts.push({type: 'put', key: imageKey, value: imageRedSelo});
      opts.push({type: 'put', key: imageIndexKey, value: {key: imageKey}});
      testDB.batch(opts, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }).then(() => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: `/items/${itemKey}`,
      params: {
        id: `${itemKey}`
      }
    });
    const res = httpMocks.createResponse();

    ItemController.getById(req, res, () => {

      const data = res._getData();
      t.equal(res.statusCode, expected.statusCode, 'should be same title');
      t.equal(data.title, expected.title, 'should be same title');
      t.equal(data.imageUrls.length, expected.imageUrls.length, 'should be same length');
      t.end();
    });
  }).catch(() => {
    t.fail();
    t.end();
  });
});
test('get by area from database', t => {
  const expected = {
    status: 200,
    message: 'success',
    items: [
      {
        key: 'item-8523910540000-b82e-473b-1234-ead0f190b005',
        imageUrls: [
          'image-8523569763000-b82e-473b-1234-ead0fzr0b000',
          'image-8523569764000-b82e-473b-1234-ead0fts0bze0',
          'image-8523569765000-b82e-473b-1234-eaaedts43200',
          'image-8523569766000-b82e-473b-1234-ead0f54g2500'
        ]
      },
      {
        key: 'item-8523910540001-b82e-473b-1234-ead0f190b004',
        imageUrls: [
          'image-8523569763000-b82e-473b-1234-ead0f190b000',
          'image-8523569764000-b82e-473b-1234-ead0fts0aed0',
          'image-8523569765000-b82e-473b-1234-ead0fts43200',
          'image-8523569766000-b82e-473b-1234-ead0ar4gvr00'
        ]
      },
      {
        key: 'item-8523910540002-b82e-473b-1234-ead0f190b003',
        imageUrls: [
          'image-8523570564200-b82e-473b-1234-ead0f190b000',
          'image-8523570664000-b82e-473b-1234-ead0fts0b000',
          'image-8523571664000-b82e-473b-1234-ead0fts43200',
          'image-8523574664000-b82e-473b-1234-ead0f54gvr00'
        ]
      },
      {
        key: 'item-8523910540003-b82e-473b-1234-ead0f190b002',
        imageUrls: [
          'image-8523569763000-b82e-473b-1234-ead0f190baec',
          'image-8523569764000-b82e-473b-1234-ead0fts0b000',
          'image-8523569765000-b82e-473b-1234-ead0ftae3200',
          'image-8523569766000-b82e-473b-1234-ead0f54gvrze'
        ]
      },
      {
        key: 'item-8523910540004-b82e-473b-1234-ead0f190b001',
        imageUrls: [
          'image-8523569763000-b82e-473b-1234-ead0f190ae00',
          'image-8523569764000-b82e-4zeb-1234-ead0fts0b000',
          'image-8523569765000-b82e-473b-1234-ead0fts43ze0',
          'image-8523569766000-bree-473b-1234-ead0f54gvr00'
        ]
      }
    ]
  };
  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/items?lat=37.768696&lng=-122.419495&zoom=14'
  });
  const res = httpMocks.createResponse();
  clearDB().then(initMock).then(()=>{
    ItemController.getAll(req, res, () => {
      t.equal(res.statusCode, expected.status, 'should be same status');
      const items = res._getData().items.sort((a, b) => {
        return a.key > b.key;
      });
      expected.items = expected.items.sort((a, b) => {
        return a.key > b.key;
      });
      for (let j = 0; j < items.length; j = j + 1) {
        t.equal(items[j].id, expected.items[j].id, 'should be same id');
        t.equal(items[j].imageUrls.length, expected.items[j].imageUrls.length,
          'should be same length');
      }
      t.end();
    });
  });
});
test('add an item to database', t => {
  const expected = {
    status: 200,
    message: 'success',
    address: itemRedSelo.address,
    idxItemsCnt: DEFAULT_PRECISON
  };
  const req = httpMocks.createRequest({
    method: 'POST',
    url: '/items',
    body: itemRedSelo
  });
  const res = httpMocks.createResponse();
  new Promise((resolve, reject) => {
    S3Utils.imgToBase64('src/test/node/small-test.png', (err, base64Img) => {
      return (err) ? reject(err) : resolve(base64Img);
    });
  })
  .then((base64Img) => {
    return new Promise((resolve) => {
      itemRedSelo.image = base64Img;
      clearDB().then(resolve);
    });
  })
  .then(()=>{
    return new Promise((resolve) => {
      ItemController.addItem(req, res, ()=>{
        resolve();
      });
    });
  })
  .then(()=>{
    const status = res.statusCode;
    const message = res._getData().message;
    const key = res._getData().data;
    const timeHash = KeyUtils.getTimeHash(key);
    t.equal(status, expected.status, 'should be same status');
    t.equal(message, expected.message, 'should be same message');
    let error;
    let addedItem;
    const addedIdxItems = [];
    let addedImage;
    testDB.createReadStream({
      start: '\x00',
      end: '\xFF'
    }).on('data', (data) => {
      if (KeyUtils.getTimeHash(data.key) !== timeHash) {
        t.fail(`TimeHash is wrong : ${KeyUtils.getTimeHash(data.key)}`);
        t.end();
      }
      const isOriginKey = KeyUtils.isOriginKey(data.key);
      const isItem = data.key.startsWith('item-');
      // Case of origin item having information about event data(title, geolocation..).
      if (isItem && isOriginKey) {
        addedItem = data.value;
        t.equal(data.value.address, expected.address, 'should be same address');
      // Case of indexing item to search in levelDB.
      } else if (isItem && !isOriginKey) {
        addedIdxItems.push(data.value);
        if (data.value.key !== key) {
          t.fail(`Indexing item's key is wrong : ${data.value.key}`);
          t.end();
        }      // Case of origin image having information about image data(userKey, caption...).
      } else if (!isItem && isOriginKey) {
        addedImage = data.value;
      }
    }).on('error', (err) => {
      error = err;
    }).on('close', () => {
      if (error) {
        t.fail('database error');
        t.end();
        return;
      }
      t.equal(addedIdxItems.length, expected.idxItemsCnt,
      'should be same number of indexing items');
      t.equal(addedItem.createdTime, addedImage.createdTime,
      'should be created time');
      t.end();
    });
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable */
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
/*
test('delete an item from database', t => {
  const expected = {
    status: 200,
    message: 'success',
    itemCnt: 1,
    indexingItemCntBefore: DEFAULT_PRECISON,
    statusCodeBefore: STATE.ALIVE,
    statusCodeAfter: STATE.REMOVED
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
          statusCode = data.key.charAt(STATE_CODE_POS);
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
                statusCode = data.key.charAt(STATE_CODE_POS);
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
*/
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
