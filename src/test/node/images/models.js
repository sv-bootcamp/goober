import test from 'tape';
import testDB, {clearDB} from '../../../server/database';
import ImageManager from '../../../server/images/models';

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
      ImageManager.fetchPrefix(prefix, (err, value) => {
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
