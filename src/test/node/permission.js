import test from 'tape';
import httpMock from 'node-mocks-http';
import {requiredPermission, requiredAdmin, PERMISSION, ADMIN_SECRET}
  from '../../server/permission';

test('required RW permitted RW', t => {
  const req = httpMock.createRequest({
    method: 'GET/POST/PUT/DELETE',
    url: '/all/urls',
    headers: {
      permission: PERMISSION.RW
    }
  });
  const res = httpMock.createResponse();
  requiredPermission(PERMISSION.RW)(req, res, () => {
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
  requiredPermission(PERMISSION.RW)(req, res, () => {
    t.fail();
    t.end();
  });
  t.equal(res.statusCode, expected.statusCode, 'should be same status');
  t.end();
});

test('required RW permitted nothing', t => {
  const expected = {
    statusCode: 403
  };

  const req = httpMock.createRequest({
    method: 'GET/POST/PUT/DELETE',
    url: '/all/urls',
    headers: {}
  });
  const res = httpMock.createResponse();

  requiredPermission(PERMISSION.RW)(req, res, (err) => {
    if (err) {
      t.skip('error is occured (valid)');
      t.equal(err.statusCode, expected.statusCode, 'should be same status');
      t.end();
      return;
    }
    t.fail();
    t.end();
  });
});

test('required Admin permitted as administrator', t => {
  const req = httpMock.createRequest({
    method: 'GET/POST/PUT/DELETE',
    url: '/all/urls',
    headers: {
      authorization: ADMIN_SECRET
    }
  });
  const res = httpMock.createResponse();

  requiredAdmin(PERMISSION.RW)(req, res, (err) => {
    if (err) {
      t.comment(err.message);
      t.fail();
      t.end();
      return;
    }
    t.pass('error is occured (valid)');
    t.end();
  });
});

test('required Admin permitted nothing', t => {
  const req = httpMock.createRequest({
    method: 'GET/POST/PUT/DELETE',
    url: '/all/urls',
    headers: {
      authorization: 'i am not administrator'
    }
  });
  const res = httpMock.createResponse();

  requiredAdmin(PERMISSION.RW)(req, res, (err) => {
    if (err) {
      t.pass('error is occured (valid)');
      t.end();
      return;
    }
    t.fail();
    t.end();
  });
});
