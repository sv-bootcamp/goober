import test from 'tape';
import Controller from '../../../server/reports/controllers';
import httpMocks from 'node-mocks-http';

test('reports controller post ', t => {
  const expected = {
    status: 200,
    message: 'success'
  };
  const req = httpMocks.createRequest({
    method: 'POST',
    url: '/reports'
  });
  const res = httpMocks.createResponse();
  Controller.post(req, res, () => {
    t.equal(res.statusCode, expected.status,
    'should be same status');
    t.equal(res._getData().message, expected.message,
    'should be same message');
    t.end();
  });
});
