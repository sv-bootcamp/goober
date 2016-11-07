import test from 'tape';
import testDB, {clearDB, initMock, fetchPrefix} from '../../../server/database';
import ImageManager from '../../../server/images/models';
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
test('get Image Urls using itemKey', t => {
  const testItemKey = mockItems[0].key;
  const expectedImgCnt = mockImages.filter((mockImage) => {
    return (mockImage.value.itemKey === testItemKey) ? true : false;
  }).length;
  t.notEqual(expectedImgCnt, 0, `number of images of test Key : ${expectedImgCnt}`);
  clearDB().then(initMock).then(()=>{
    ImageManager.getImages(testItemKey, (err, urls)=>{
      t.equal(urls.length, expectedImgCnt, 'should be same length');
      t.end();
    });
  });
});
