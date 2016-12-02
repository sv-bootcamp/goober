import test from 'tape';
import httpMocks from 'node-mocks-http';
import controller from '../../../server/admin/controllers';
import {clearDB, putPromise, getPromise} from '../../../server/database';

test('admin db_get a key', t => {
  const expected = {
    key: 'some-key',
    value: 'some-value',
    statusCode: 200
  };
  const req = httpMocks.createRequest({
    method: 'GET',
    url: `/api/admin/db?prefix=${expected.key}`,
    query: {
      prefix: expected.key
    }
  });
  const res = httpMocks.createResponse();

  clearDB().then(() => {
    return putPromise(expected.key, expected.value);
  }).then(() => {
    controller.db_get(req, res, () => {
      const collection = res._getData()[0];
      t.equal(res.statusCode, expected.statusCode, 'should be same status');
      t.ok(collection, 'should be exist');
      t.equal(collection.key, expected.key, 'should be same key');
      t.equal(collection.value, expected.value, 'should be same value');
      t.end();
    });
  }).catch((err) => {
    t.comment(err);
    t.fail();
    t.end();
  });
});

test('admin db_get several keys', t => {
  const mockData = [
    {key: 'key-A', value: 'value-A'},
    {key: 'key-B', value: 'value-B'}
  ];
  const expected = {
    length: mockData.length,
    statusCode: 200
  };
  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/api/admin/db?prefix=key',
    query: {
      prefix: 'key'
    }
  });
  const res = httpMocks.createResponse();

  clearDB().then(() => {
    return putPromise(mockData[0].key, mockData[0].value);
  }).then(() => {
    return putPromise(mockData[1].key, mockData[1].value);
  }).then(() => {
    controller.db_get(req, res, () => {
      const collection = res._getData();
      t.equal(res.statusCode, expected.statusCode, 'should be same status');
      t.ok(collection, 'should be exist');
      t.equal(collection[0].key, mockData[0].key, 'should be same key');
      t.equal(collection[1].value, mockData[1].value, 'should be same value');
      t.end();
    });
  }).catch((err) => {
    t.comment(err);
    t.fail();
    t.end();
  });
});

test('admin db_post', t => {
  const expected = {
    key: 'some-key',
    value: 'some-value',
    statusCode: 200
  };
  const req = httpMocks.createRequest({
    method: 'POST',
    url: '/api/admin/db',
    body: {
      key: expected.key,
      value: expected.value
    }
  });
  const res = httpMocks.createResponse();

  clearDB().then(() => {
    return putPromise(expected.key, expected.value);
  }).then(() => {
    controller.db_post(req, res, () => {
      t.equal(res.statusCode, expected.statusCode, 'should be same status');
      getPromise(expected.key).then(() => {
        t.pass('Item was posted successfully');
        t.end();
      }).catch((err) => {
        t.comment(err);
        t.fail();
        t.end();
      });
    });
  }).catch((err) => {
    t.comment(err);
    t.fail();
    t.end();
  });
});

test('admin db_delete', t => {
  const mockData = { key: 'key', value: 'value'};
  const expected = {
    statusCode: 200
  };
  const req = httpMocks.createRequest({
    method: 'DELETE',
    url: `/api/admin/db/${mockData.key}`,
    params: {
      id: mockData.key
    }
  });
  const res = httpMocks.createResponse();

  clearDB().then(() => {
    return putPromise(mockData.key, mockData.value);
  }).then(() => {
    return getPromise(mockData.key);
  }).then((value) => {
    t.equal(value, mockData.value, 'should be same value');
  }).then(() => {
    controller.db_delete(req, res, () => {
      t.equal(res.statusCode, expected.statusCode, 'should be same status');
      getPromise(mockData.key).then(() => {
        t.comment('Data exists in database');
        t.fail();
        t.end();
      }).catch(() => {
        t.pass('Item was posted successfully');
        t.end();
      });
    });
  }).catch((err) => {
    t.comment(err);
    t.fail();
    t.end();
  });
});

