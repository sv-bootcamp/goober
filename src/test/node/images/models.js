import test from 'tape';
import testDB, {clearDB, fetchPrefix, putPromise} from '../../../server/database';
import {ENTITY, STATE} from '../../../server/key-utils';
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
