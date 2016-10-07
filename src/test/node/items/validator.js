import test from 'tape';
import httpMocks from 'node-mocks-http';
import validator from '../../../server/items/validator';

const mockData = {
  title: 'title',
  lat: 30.565398,
  lng: 126.9907941,
  address: 'Red Selo',
  categoryWarning: 'warning',
  categoryEvent: 'event',
  categoryFacility: 'facility',
  startTime: '2016-10-04T04:00:00.578Z',
  endTime: '2016-10-04T04:00:00.578Z'
};

test('valid item key', t => {
  const expected = {
    key: 'item-wv6mcsrb-5795ef07-d25c-42b2-8797-c242acaa5a9a'
  };
  const req = httpMocks.createRequest({
    method: 'GET',
    url: `/items/${expected.key}`,
    params: {
      id: `${expected.key}`
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (request) => {
    t.equal(request.params.id, expected.key, 'should be same key');
    t.end();
  };
  validator(req, res, callback);
});
test('invalid item key', t => {
  const key = 'not-a-item';
  const expected = {
    statusCode: 400,
    message: 'wrong item Id'
  };
  const req = httpMocks.createRequest({
    method: 'GET',
    url: `/items/${key}`,
    params: {
      id: `${key}`
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (err) => {
    t.equal(err.statusCode, expected.statusCode, 'should be same status');
    t.equal(err.message, expected.message, 'should be same massage');
    t.end();
  };
  validator(req, res, callback);
});

test('valid item title', t => {
  const expected = {
    title: mockData.title
  };
  const req = httpMocks.createRequest({
    body: {
      title: expected.title
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (request) => {
    t.equal(request.body.title, expected.title, 'should be same title');
    t.end();
  };
  validator(req, res, callback);
});
test('invalid item title', t => {
  const expected = {
    statusCode: 400,
    message: 'wrong item title'
  };
  const req = httpMocks.createRequest({
    body: {
      title: 123
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (err) => {
    t.equal(err.statusCode, expected.statusCode, 'should be same status');
    t.equal(err.message, expected.message, 'should be same massage');
    t.end();
  };
  validator(req, res, callback);
});

test('valid item latitude', t => {
  const expected = {
    lat: mockData.lat
  };
  const req = httpMocks.createRequest({
    body: {
      lat: expected.lat
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (request) => {
    t.equal(request.body.lat, expected.lat, 'should be same latitude');
    t.end();
  };
  validator(req, res, callback);
});
test('invalid item latitude', t => {
  const expected = {
    statusCode: 400,
    message: 'wrong item lat'
  };
  const req = httpMocks.createRequest({
    body: {
      lat: '123'
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (err) => {
    t.equal(err.statusCode, expected.statusCode, 'should be same status');
    t.equal(err.message, expected.message, 'should be same massage');
    t.end();
  };
  validator(req, res, callback);
});

test('valid item longitude', t => {
  const expected = {
    lng: mockData.lng
  };
  const req = httpMocks.createRequest({
    body: {
      lng: expected.lng
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (request) => {
    t.equal(request.body.lng, expected.lng, 'should be same longitude');
    t.end();
  };
  validator(req, res, callback);
});
test('invalid item longitude', t => {
  const expected = {
    statusCode: 400,
    message: 'wrong item lng'
  };
  const req = httpMocks.createRequest({
    body: {
      lng: '123'
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (err) => {
    t.equal(err.statusCode, expected.statusCode, 'should be same status');
    t.equal(err.message, expected.message, 'should be same massage');
    t.end();
  };
  validator(req, res, callback);
});

test('valid item address', t => {
  const expected = {
    address: mockData.address
  };
  const req = httpMocks.createRequest({
    body: {
      address: expected.address
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (request) => {
    t.equal(request.body.address, expected.address, 'should be same address');
    t.end();
  };
  validator(req, res, callback);
});
test('invalid item address', t => {
  const expected = {
    statusCode: 400,
    message: 'wrong item address'
  };
  const req = httpMocks.createRequest({
    body: {
      address: 123
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (err) => {
    t.equal(err.statusCode, expected.statusCode, 'should be same status');
    t.equal(err.message, expected.message, 'should be same massage');
    t.end();
  };
  validator(req, res, callback);
});

test('valid item createdDate', t => {
  const expected = {
    createdDate: mockData.createdDate
  };
  const req = httpMocks.createRequest({
    body: {
      createdDate: expected.createdDate
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (request) => {
    t.equal(request.body.createdDate, expected.createdDate, 'should be same createdDate');
    t.end();
  };
  validator(req, res, callback);
});
test('invalid item createdDate', t => {
  const expected = {
    statusCode: 400,
    message: 'wrong item createdDate'
  };
  const req = httpMocks.createRequest({
    body: {
      createdDate: 123
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (err) => {
    t.equal(err.statusCode, expected.statusCode, 'should be same status');
    t.equal(err.message, expected.message, 'should be same massage');
    t.end();
  };
  validator(req, res, callback);
});

test('valid item modifiedDate', t => {
  const expected = {
    modifiedDate: mockData.modifiedDate
  };
  const req = httpMocks.createRequest({
    body: {
      modifiedDate: expected.modifiedDate
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (request) => {
    t.equal(request.body.modifiedDate, expected.modifiedDate, 'should be same modifiedDate');
    t.end();
  };
  validator(req, res, callback);
});
test('invalid item modifiedDate', t => {
  const expected = {
    statusCode: 400,
    message: 'wrong item modifiedDate'
  };
  const req = httpMocks.createRequest({
    body: {
      modifiedDate: 123
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (err) => {
    t.equal(err.statusCode, expected.statusCode, 'should be same status');
    t.equal(err.message, expected.message, 'should be same massage');
    t.end();
  };
  validator(req, res, callback);
});

test('valid item startTime', t => {
  const expected = {
    startTime: mockData.startTime
  };
  const req = httpMocks.createRequest({
    body: {
      startTime: expected.startTime
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (request) => {
    t.equal(request.body.startTime, expected.startTime, 'should be same startTime');
    t.end();
  };
  validator(req, res, callback);
});
test('invalid item startTime', t => {
  const expected = {
    statusCode: 400,
    message: 'wrong item startTime'
  };
  const req = httpMocks.createRequest({
    body: {
      startTime: 123
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (err) => {
    t.equal(err.statusCode, expected.statusCode, 'should be same status');
    t.equal(err.message, expected.message, 'should be same massage');
    t.end();
  };
  validator(req, res, callback);
});

test('valid item endTime', t => {
  const expected = {
    endTime: mockData.endTime
  };
  const req = httpMocks.createRequest({
    body: {
      endTime: expected.endTime
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (request) => {
    t.equal(request.body.endTime, expected.endTime, 'should be same endTime');
    t.end();
  };
  validator(req, res, callback);
});
test('invalid item endTime', t => {
  const expected = {
    statusCode: 400,
    message: 'wrong item endTime'
  };
  const req = httpMocks.createRequest({
    body: {
      endTime: 123
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (err) => {
    t.equal(err.statusCode, expected.statusCode, 'should be same status');
    t.equal(err.message, expected.message, 'should be same massage');
    t.end();
  };
  validator(req, res, callback);
});

test('valid item category (warning)', t => {
  const expected = {
    category: mockData.categoryWarning
  };
  const req = httpMocks.createRequest({
    body: {
      category: expected.category
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (request) => {
    t.equal(request.body.category, expected.category, 'should be same category');
    t.end();
  };
  validator(req, res, callback);
});
test('valid item category (event)', t => {
  const expected = {
    category: mockData.categoryEvent
  };
  const req = httpMocks.createRequest({
    body: {
      category: expected.category
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (request) => {
    t.equal(request.body.category, expected.category, 'should be same category');
    t.end();
  };
  validator(req, res, callback);
});
test('valid item category (facility)', t => {
  const expected = {
    category: mockData.categoryFacility
  };
  const req = httpMocks.createRequest({
    body: {
      category: expected.category
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (request) => {
    t.equal(request.body.category, expected.category, 'should be same category');
    t.end();
  };
  validator(req, res, callback);
});
test('invalid item category', t => {
  const expected = {
    statusCode: 400,
    message: 'wrong item category'
  };
  const req = httpMocks.createRequest({
    body: {
      category: 'default'
    },
    validatorTest: true
  });
  const res = httpMocks.createResponse();
  const callback = (err) => {
    t.equal(err.statusCode, expected.statusCode, 'should be same status');
    t.equal(err.message, expected.message, 'should be same massage');
    t.end();
  };
  validator(req, res, callback);
});
