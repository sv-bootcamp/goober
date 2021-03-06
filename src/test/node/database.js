import test from 'tape';
import db, {clearDB, putPromise, getPromise, fetchValues} from '../../server/database';

test('database clear', t => {
  const onClear = () =>{
    const dataList = [];
    let error;
    db.createReadStream({
      start: '\x00',
      end: '\xFF'
    }).on('data', (data) => {
      dataList.push(data.value);
    }).on('error', (err) => {
      error = err;
    }).on('close', () => {
      if (error) {
        t.fail('Internal database error');
        return t.end();
      }
      if (dataList.length > 0) {
        t.fail('database is not empty');
        return t.end();
      }
      t.pass('database is empty');
      return t.end();
    });
  };
  clearDB().then(onClear);
});

test('put data into database by promise', t => {
  const mockUser = {
    key: 'mockUserKey',
    userType: 'anonymous',
    userId: 'mockUserId',
    name: 'mockName'
  };
  const expected = mockUser;

  clearDB()
    .then(() => {
      return putPromise(mockUser.key, mockUser);
    })
    .then(() => {
      db.get(mockUser.key, (err, data) => {
        if (err) {
          t.fail();
          return t.end(err);
        }
        t.equal(data.key, expected.key, 'should be same user key');
        t.equal(data.name, expected.name, 'should be same user name');
        return t.end();
      });
    })
    .catch(err => {
      t.fail();
      t.end(err);
    });
});

test('get data from database by promise', t => {
  const mockUser = {
    key: 'mockUserKey',
    userType: 'anonymous',
    userId: 'mockUserId',
    name: 'mockName'
  };
  const expected = mockUser;

  clearDB()
    .then(() => {
      db.put(mockUser.key, mockUser, dbErr => {
        if (dbErr) {
          t.fail();
          return t.end(dbErr);
        }
        return getPromise(mockUser.key)
          .then(data => {
            t.equal(data.key, expected.key, 'should be same user key');
            t.equal(data.name, expected.name, 'should be same user name');
            t.end();
          })
          .catch(err => {
            t.fail();
            t.end(err);
          });
      });
    })
    .catch(err => {
      t.fail();
      t.end(err);
    });
});

test('fetchValues', t => {
  const testKeys = ['key-00', 'key-01'];
  const testVals = ['val-00', 'val-01'];
  const ops = [
    { type: 'put', key: testKeys[0], value: testVals[0] },
    { type: 'put', key: testKeys[1], value: testVals[1] }
  ];
  clearDB()
    .then(() => new Promise((resolve, reject) =>
      db.batch(ops, err => err ? reject(err) : resolve())))
    .then(()=> fetchValues(testKeys))
    .then(values => {
      t.deepEqual(values, testVals, 'should be same values');
      t.end();
    })
    .catch(err => {
      t.fail();
      t.end(err);
    });
});
