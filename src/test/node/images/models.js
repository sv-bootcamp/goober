import test from 'tape';
import testDB, {clearDB, fetchPrefix, putPromise, getPromise, initMock}
  from '../../../server/database';
import {ENTITY, STATE} from '../../../server/key-utils';
import ImageManager from '../../../server/images/models';
import {IMAGE_SIZE_PREFIX} from '../../../server/aws-s3';
import {mockImages, mockItems} from '../../../server/database-mock-data';
test('fetch prefix ImageManager', t => {
  const prefix = 'this-is-prefix';
  const keys = [
    `${prefix}-A`,
    `${prefix}-B`,
    `NOT-${prefix}-A`,
    `NOT-${prefix}-B`
  ];
  const expectedLength = 2;

  clearDB().then(() => {
    const opts = [];
    for (let i = 0; i < keys.length; i = i + 1) {
      opts.push({
        type: 'put',
        key: keys[i],
        value: {
          key: 'some-origin-key'
        }
      });
    }
    testDB.batch(opts, (errBatch) => {
      if (errBatch) {
        t.fail('database batch error');
        t.end();
        return;
      }
      fetchPrefix(prefix, (err, value) => {
        if (err) {
          t.fail('fetchPrefix error');
          t.end();
          return;
        }
        t.equal(value.length, expectedLength, 'should be same length');
        t.end();
      });
    });
  });
});

test('count image of item', t => {
  const mockItemKey = 'item-something';
  const mockAliveImageKeys = [`${ENTITY.IMAGE}-${STATE.ALIVE}-${mockItemKey}-someUniqueString`];
  const mockExpiredImageKeys = [`${ENTITY.IMAGE}-${STATE.EXPIRED}-${mockItemKey}-someUniqueString`];
  const mockImageKeys = mockAliveImageKeys.concat(mockExpiredImageKeys);

  const expected = {
    lengthAlive: mockAliveImageKeys.length,
    lengthExpired: mockExpiredImageKeys.length,
    lengthBoth: mockImageKeys.length
  };

  putPromise(mockItemKey, {})
  .then(() => { return putPromise(mockImageKeys[0], {}); }) // eslint-disable-line brace-style
  .then(() => { return putPromise(mockImageKeys[1], {}); }) // eslint-disable-line brace-style
  .then(() => {
    return ImageManager.countImageOfItem(mockItemKey, STATE.ALIVE);
  }).then((length) => {
    t.equal(length, expected.lengthAlive, 'should be same length');
  }).then(() => {
    return ImageManager.countImageOfItem(mockItemKey, STATE.EXPIRED);
  }).then((length) => {
    t.equal(length, expected.lengthExpired, 'should be same length');
  }).then(() => {
    return ImageManager.countImageOfItem(mockItemKey, STATE.ALIVE, STATE.EXPIRED);
  }).then((length) => {
    t.equal(length, expected.lengthBoth, 'should be same length');
    t.end();
  }).catch(err => {
    t.comment(err);
    t.fail();
    t.end();
  });
});

test('make simple image objects(ImageManager.getImageObjList)', t => {
  const testImageKeys = mockImages.map((image)=>{
    return image.key;
  });
  const expected = {
    length: testImageKeys.length
  };
  const result = ImageManager.getImageObjList(testImageKeys).map(obj=>{
    if (!obj.hasOwnProperty('imageKey')) {
      t.fail('there is no imageKey Field');
    }
    if (!obj.hasOwnProperty('imageUrl')) {
      t.fail('there is no imageUrl Field');
    }
  });
  t.equal(result.length, expected.length,
    `should be same length: ${result.length}`);
  t.end();
});

test('getImageKeys', t => {
  const testItem = mockItems[0];
  clearDB()
    .then(initMock)
    .then(()=> ImageManager.getImageKeys(testItem.key))
    .then(imageKeys => {
      t.ok(imageKeys.length, 'not empty imageKeys array');
      return Promise.all(imageKeys.map(
        imageKey => getPromise(imageKey).then(imageVal => t.equal(imageVal.key, imageKey,
          'should be same key of image value'))));
    }).then(() => t.end())
    .catch(err => {
      t.fail();
      t.end(err);
    });
});

test('ImageManager.getImageUrls', t => {
  const itemKey = mockItems[0].key;
  const isThumbnail = true;
  clearDB()
    .then(initMock)
    .then(()=>ImageManager.getImageUrls({itemKey, isThumbnail}))
    .then(urls => {
      t.ok(urls.length, 'not empty urls array');
      urls.map(url => {
        t.equal(url.startsWith('url-of-'), true, 'should start with prefix');
        t.equal(url.includes(IMAGE_SIZE_PREFIX.THUMBNAIL), isThumbnail,
          `isThumbnail : should be ${isThumbnail}`);
      });
      t.end();
    }).catch(err => {
      t.fail();
      t.end(err);
    });
});

