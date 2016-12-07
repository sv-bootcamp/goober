import test from 'tape';
import ItemController from '../../../server/items/controllers';
import httpMocks from 'node-mocks-http';
import testDB, {initMock, clearDB} from '../../../server/database';
import {DEFAULT_PRECISON, KeyUtils, STATE, ENTITY}
        from '../../../server/key-utils';
import uuid from 'uuid4';
import {S3Utils} from '../../../server/aws-s3';
import {STATE_STRING} from '../../../server/items/models';
import {mockItems} from '../../../server/database-mock-data';

const itemRedSelo = {
  title: 'This is Red Selo',
  lat: 30.565398,
  lng: 126.9907941,
  address: 'Red Selo',
  category: 'warning',
  userKey: `user-${uuid()}`,
  caption: 'Sample image caption of itemRedSelo.',
  startTime: '2016-10-13T01:11:46.851Z',
  endTime: '2016-10-15T01:11:46.851Z',
  state: STATE_STRING[STATE.ALIVE]
};
const itemAlaska = {
  title: 'This is Alaska',
  lat: 37.565398,
  lng: 126.9907941,
  address: 'Alaska',
  category: 'warning',
  userKey: `user-${uuid()}`,
  caption: 'Sample image caption of itemAlaska.',
  startTime: '2016-10-13T01:11:46.851Z',
  endTime: '2016-10-15T01:11:46.851Z',
  state: STATE_STRING[STATE.ALIVE]
};
const imageRedSelo = {
  caption: 'red-selo',
  userKey: 'user1'
};

test('get all items from database', t => {
  let key1 = `item-${KeyUtils.genTimeHash(new Date())}`;
  let key2 = `item-${KeyUtils.genTimeHash(new Date())}`;

  // https://github.com/Level/levelup#introduction
  // LevelDB stores entries sorted lexicographically by keys.
  if (key2 < key1) {
    const temp = key2;
    key2 = key1;
    key1 = temp;
  }

  const expected = {
    status: 200,
    items: [itemRedSelo, itemAlaska]
  };
  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/items'
  });
  const res = httpMocks.createResponse();
  clearDB().then(() => {
    const opt = [{ type: 'put', key: key1, value: itemRedSelo},
      { type: 'put', key: key2, value: itemAlaska}];
    testDB.batch(opt, (err) => {
      if (err) {
        t.fail(err);
        t.end();
        return;
      }
      ItemController.getAll(req, res, () => {
        const data = res._getData();
        t.equal(res.statusCode, expected.status,
          'should be same status');
        t.equal(data.items[0].title, expected.items[0].title,
          'should be same title');
        t.equal(data.items[1].title, expected.items[1].title,
          'should be same title');
        t.end();
      });
    });
  });
});
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
    items: [
      {
        key: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
        imageUrls: [
          'image-8523569763000-dd3860f5-b82e-473b-1234-ead0fzr0b000',
          'image-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0bze0',
          'image-8523569765000-dd3860f5-b82e-473b-1234-eaaedts43200',
          'image-8523569766000-dd3860f5-b82e-473b-1234-ead0f54g2500'
        ]
      },
      {
        key: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
        imageUrls: [
          'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190b000',
          'image-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0aed0',
          'image-8523569765000-dd3860f5-b82e-473b-1234-ead0fts43200',
          'image-8523569766000-dd3860f5-b82e-473b-1234-ead0ar4gvr00'
        ]
      },
      {
        key: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
        imageUrls: [
          'image-8523570564200-dd3860f5-b82e-473b-1234-ead0f190b000',
          'image-8523570664000-dd3860f5-b82e-473b-1234-ead0fts0b000',
          'image-8523571664000-dd3860f5-b82e-473b-1234-ead0fts43200',
          'image-8523574664000-dd3860f5-b82e-473b-1234-ead0f54gvr00'
        ]
      },
      {
        key: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
        imageUrls: [
          'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190baec',
          'image-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0b000',
          'image-8523569765000-dd3860f5-b82e-473b-1234-ead0ftae3200',
          'image-8523569766000-dd3860f5-b82e-473b-1234-ead0f54gvrze'
        ]
      },
      {
        key: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
        imageUrls: [
          'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190ae00',
          'image-8523569764000-dd3860f5-b82e-4zeb-1234-ead0fts0b000',
          'image-8523569765000-dd3860f5-b82e-473b-1234-ead0fts43ze0',
          'image-8523569766000-dd3860f5-bree-473b-1234-ead0f54gvr00'
        ]
      },
      {
        key: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
        imageUrls: [
          'image-8523569761934-dd3860f5-b82e-473b-1234-ead0f190b000',
          'image-8523569761934-dd3860f5-b82e-473b-1234-ead0fts0b000',
          'image-8523569761934-dd3860f5-b82e-473b-1234-ead0fts43200',
          'image-8523569761934-dd3860f5-b82e-473b-1234-ead0f54gvr00'
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
      const items = res._getData().items;
      if (items.length === 0) {
        t.fail('respone data is empty');
      }
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
  const mockItem = mockItems[0].value;
  const expected = {
    status: 200,
    message: 'success',
    address: mockItem.address,
    idxItemsCnt: DEFAULT_PRECISON
  };
  const req = httpMocks.createRequest({
    method: 'POST',
    url: 'api/items',
    body: mockItem
  });
  req.headers.userKey = mockItem.userKey;
  const res = httpMocks.createResponse();
  new Promise((resolve, reject) => {
    S3Utils.imgToBase64('src/test/node/small-test.png', (err, base64Img) => {
      return (err) ? reject(err) : resolve(base64Img);
    });
  })
  .then((base64Img) => {
    return new Promise((resolve) => {
      mockItem.image = base64Img;
      clearDB().then(resolve);
    });
  })
  .then(()=>{
    return new Promise((resolve) => {
      ItemController.add(req, res, ()=>{
        resolve();
      });
    });
  })
  .then(()=>{
    const status = res.statusCode;
    const message = res._getData().message;
    const key = res._getData().data;
    const timeHash = KeyUtils.parseTimeHash(key);
    t.equal(status, expected.status, 'should be same status');
    t.equal(message, expected.message, 'should be same message');
    let error;
    let addedItem;
    const addedIdxItems = [];
    let addedImage;
    let addedCreatedPost;
    testDB.createReadStream({
      start: '\x00',
      end: '\xFF'
    }).on('data', (data) => {
      if (KeyUtils.parseTimeHash(data.key) !== timeHash) {
        t.fail(`TimeHash is wrong : ${KeyUtils.parseTimeHash(data.key)}`);
        t.end();
      }
      const entity = data.key.split('-')[0];
      const isOriginKey = KeyUtils.isOriginKey(data.key);
      switch (entity) {
      case ENTITY.ITEM:
        if (isOriginKey) {
          addedItem = data.value;
          t.equal(data.value.address, expected.address, 'should be same address');
        } else {
          addedIdxItems.push(data.value);
          if (data.value.key !== key) {
            t.fail(`Indexing item's key is wrong : ${data.value.key}`);
            t.end();
          }
        }
        break;
      case ENTITY.IMAGE:
        if (isOriginKey) {
          addedImage = data.value;
        }
        break;
      case ENTITY.CREATED_POST:
        t.equal(KeyUtils.parseTimeHash(data.key), timeHash,
        'should be same time hash');
        t.notEqual(data.key.indexOf(mockItem.userKey), -1,
        'should be had user key in createdPost key');
        addedCreatedPost = data.value;
        break;
      default :
        t.fail(`catched wrong key : ${data.key}`);
        break;
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
      t.equal(addedCreatedPost.itemKey, key,
      'should be same itemKey');
      t.equal(addedCreatedPost.imageKey, addedImage.key,
      'should be same imageKey');
      t.end();
    });
  })
  .catch((err) => {
    t.fail();
    t.end(err);
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
  const testItem = mockItems[0].value;
  const timeHash = KeyUtils.parseTimeHash(testItem.key);
  const expected = {
    status: 200,
    message: 'success',
    itemCnt: 1,
    indexingItemCntBefore: DEFAULT_PRECISON,
    key: testItem.key,
    title: testItem.title,
    stateCode: STATE.REMOVED,
    stateString: STATE_STRING[STATE.REMOVED]
  };
  const req = httpMocks.createRequest({
    method: 'DELETE',
    url: `/items/${expected.key}`,
    params: {
      id: expected.key
    }
  });
  const res = httpMocks.createResponse();
  clearDB().then(initMock).then(()=>{
    return new Promise((resolve, reject)=> {
      ItemController.remove(req, res, () => {
        const status = res.statusCode;
        const message = res._getData().message;
        t.equal(status, expected.status, 'should be same status');
        t.equal(message, expected.message, 'should be same message');
        if (status !== expected.status || message !== expected.message) {
          reject(new Error('Not equal with expected value'));
          return;
        }
        resolve();
      });
    }).then(()=>{
      return new Promise((resolve, reject)=> {
        testDB.createReadStream({
          start: `${ENTITY.ITEM}-`,
          end: `${ENTITY.ITEM}-\xFF`
        }).on('data', (data) => {
          if (data.key.includes(timeHash)) {
            if (KeyUtils.isOriginKey(data.key)) {
              // in case of an original key
              t.equal(data.value.title, expected.title, 'should be same title');
              t.equal(data.value.state, expected.stateString,
              `should be same state : ${expected.stateString}`);
            } else {
              // in case of indexing keys
              const stateCode = KeyUtils.parseState(data.key);
              if (stateCode !== STATE.REMOVED) {
                t.fail(`wrong state code : ${stateCode}`);
              }
              if (data.value.key !== expected.key) {
                t.faile(`wrong key : ${data.value.key}`);
              }
            }
          }
        }).on('error', (err) => {
          reject(err);
          return;
        }).on('close', () => {
          resolve();
        });
      });
    }).then(()=>{
      let removedCreatedPost;
      testDB.createReadStream({
        start: `${ENTITY.CREATED_POST}-${STATE.REMOVED}-`,
        end: `${ENTITY.CREATED_POST}-${STATE.REMOVED}-\xFF`
      }).on('data', (data) => {
        if (data.key.indexOf(KeyUtils.parseTimeHash(testItem.key)) !== -1) {
          removedCreatedPost = data.value;
        }
      }).on('error', (err) => {
        t.fail();
        t.end(err);
        return;
      }).on('close', () => {
        t.equal(removedCreatedPost.itemKey, expected.key,
        'Should be same key(removed created post).');
        t.end();
      });
    }).catch((err)=>{
      t.fail();
      t.end(err);
    });
  });
});
