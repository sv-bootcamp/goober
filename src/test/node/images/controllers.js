import test from 'tape';
import {STATE, KeyUtils, ENTITY} from '../../../server/key-utils';
import testDB, {clearDB, initMock, getPromise} from '../../../server/database';
import controller from '../../../server/images/controllers';
import httpMocks from 'node-mocks-http';
import {S3Utils} from '../../../server/aws-s3';
import {mockImages, mockImageIndexies, mockCreatedPosts, mockUsers}
  from '../../../server/database-mock-data';

const MockImageA = {
  key: 'image-8523306706662-c8a94c49-0c3c-414a-bec0-74fc369a105e',
  userKey: 'user-1234uuid',
  caption: 'thisissmaplecode.',
  createdDate: '2016-10-17T08:34:53.338Z'
};
const MockImageB = {
  itemKey: 'item-8500000000000-aaaa-aaaa-aaaa-aaaaaaaaa000',
  userKey: 'user-8500000000000-bbbb-bbbb-bbbb-bbbbbbbbb000',
  caption: 'Hello World'
};
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
        url: '/api/images',
        query: {
          item: itemKey
        }
      });
      const res = httpMocks.createResponse();

      controller.getAll(req, res, () => {
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
      url: `/api/images/${MockImageA.key}`,
      params: {
        id: MockImageA.key
      }
    });
    const res = httpMocks.createResponse();
    controller.getById(req, res, () => {
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
test('Post image', t => {
  const expected = {
    status: 200,
    message: 'success',
    isImageInS3: true
  };
  const req = httpMocks.createRequest({
    method: 'POST',
    url: '/images',
    body: MockImageB
  });
  req.headers.userKey = MockImageB.userKey;
  const res = httpMocks.createResponse();
  new Promise((resolve, reject) => {
    S3Utils.imgToBase64('src/test/node/test.png', (err, base64Img) => {
      return (err) ? reject(err) : resolve(base64Img);
    });
  }).then((base64Img) => {
    return new Promise((resolve, reject) => {
      MockImageB.image = base64Img;
      clearDB().then(initMock).then(resolve).catch(reject);
    });
  }).then(()=>{
    return new Promise((resolve) => {
      controller.post(req, res, resolve);
    });
  })
  .then(()=>{
    const status = res.statusCode;
    const message = res._getData().message;
    const key = res._getData().data.imageKey;
    const timeHash = KeyUtils.parseTimeHash(key);
    t.equal(res._getData().data.itemKey, MockImageB.itemKey, 'should be same item key.');
    t.equal(status, expected.status, 'should be same status');
    t.equal(message, expected.message, 'should be same message');
    let error;
    let originImage;
    let idxImage;
    let createdPost;
    testDB.createReadStream({
      start: '',
      end: '\xFF'
    }).on('data', (data) => {
      if (KeyUtils.parseTimeHash(data.key) !== timeHash) {
        return;
      }
      const entity = data.key.split('-')[0];
      const isOriginKey = KeyUtils.isOriginKey(data.key);
      switch (entity) {
      case ENTITY.IMAGE:
        if (isOriginKey) {
          originImage = data.value;
        } else {
          idxImage = data.value;
        }
        break;
      case ENTITY.CREATED_POST:
        createdPost = data.value;
        t.equal(KeyUtils.parseTimeHash(data.key), timeHash,
        'should be same time hash');
        t.notEqual(data.key.indexOf(MockImageB.userKey), -1,
        'should be had user key in createdPost key');
        break;
      default :
        t.fail(`catched wrong key : ${data.key}`);
        break;
      }
      return;
    }).on('error', (err) => {
      error = err;
    }).on('close', () => {
      if (error) {
        t.fail('database error');
        t.end();
        return;
      }
      t.equal(createdPost.imageKey, originImage.key, 'Should be same image key(createdPost)');
      t.equal(createdPost.itemKey, originImage.itemKey, 'Should be same item key(createdPost)');
      t.equal(originImage.key, idxImage.key, 'Should be same key');
      t.end();
    });
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable */
  });
});

test('Remove an image', t => {
  function notExistInDB(key) {
    return new Promise((resolve, reject) => {
      testDB.get(key, (err) => {
        if (err) {
          return err.notFound ? resolve() : reject('Database internal error');
        }
        return reject('key still exists');
      });
    });
  }
  const mockUserKey = mockUsers[0].key;
  const mockItemKey = mockImages[0].value.itemKey;
  const mockImage = mockImages[0];
  const mockImageIndex = mockImageIndexies[0];
  const mockCreatedPost = mockCreatedPosts[0];
  const expected = {
    statusCode: 200
  };
  const req = httpMocks.createRequest({
    method: 'DELETE',
    url: `/api/images/${mockImage.key}`,
    params: {
      id: mockImage.key
    }
  });
  req.headers = { userKey: mockUserKey };

  const res = httpMocks.createResponse();

  initMock().then(() => {
    return new Promise((resolve, reject) => {
      controller.remove(req, res, () => {
        return res.statusCode !== expected.statusCode ?
          reject('StatusCode is different') : resolve();
      });
    });
  }).then(() => { return notExistInDB(mockImageIndex.key); }) // eslint-disable-line brace-style
  .then(() => { return notExistInDB(mockCreatedPost.key); }) // eslint-disable-line brace-style
  .then(() => { return getPromise(mockImage.key); }) // eslint-disable-line brace-style
  .then(() => { return getPromise(mockItemKey); }) // eslint-disable-line brace-style
  .then(() => {
    t.pass('Not exist : image-index, created-post\nExist : image, item');
    t.end();
  })
  .catch((err) => {
    t.comment(err);
    t.fail();
    t.end();
  });
});
