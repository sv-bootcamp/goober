import test from 'tape';
import httpMock from 'node-mocks-http';
import {requiredPermmission, PERMISSION} from '../../server/permission';

test('required RW permitted RW', t => {
  const req = httpMock.createRequest({
    method: 'GET/POST/PUT/DELETE',
    url: '/all/urls',
    headers: {
      permission: PERMISSION.RW
    }
  });
  const res = httpMock.createResponse();
  requiredPermmission(PERMISSION.RW)(req, res, () => {
    t.ok('callback was called');
    t.end();
  });
});

test('required RW permitted R', t => {
  const expected = {
    statusCode: 403
  };
  const req = httpMock.createRequest({
    method: 'GET/POST/PUT/DELETE',
    url: '/all/urls',
    headers: {
      permission: PERMISSION.R
    }
  });
  const res = httpMock.createResponse();
  requiredPermmission(PERMISSION.RW)(req, res, () => {
    t.fail();
    t.end();
  });
  t.equal(res.statusCode, expected.statusCode, 'should be same status');
  t.end();
});

test('required RW permitted R', t => {
  const expected = {
    name: 'AssertionError'
  };
  const req = httpMock.createRequest({
    method: 'GET/POST/PUT/DELETE',
    url: '/all/urls',
    headers: {}
  });
  const res = httpMock.createResponse();

  try {
    requiredPermmission(PERMISSION.RW)(req, res, () => {
      t.fail();
    });
  } catch (error) {
    t.equal(error.name, expected.name, 'should be same error');
  } finally {
    t.end();
  }
});
