import test from 'tape';
import testDB, {clearDB, initMock, fetchPrefix} from '../../../server/database';
import ImageManager from '../../../server/images/models';
import {mockImages} from '../../../server/database-mock-data';
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

test('get Image Urls using itemKey', t => {
  const testItemKey = 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000';
  let expectedImgCnt = 0;
  for (const imageKey in mockImages) {
    if (mockImages.hasOwnProperty(imageKey)) {
      if (mockImages[imageKey].itemKey === testItemKey) {
        expectedImgCnt = expectedImgCnt + 1;
      }
    }
  }
  t.notEqual(expectedImgCnt, 0, `number of images of test Key : ${expectedImgCnt}`);
  clearDB().then(initMock).then(()=>{
    ImageManager.getImages(testItemKey, (err, urls)=>{
      t.equal(urls.length, expectedImgCnt, 'should be same length');
      t.end();
    });
  });
});
