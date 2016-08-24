import config from 'config';
import request from 'request';
import sinon from 'sinon';
import test from 'tape';
import startServer from '../../server';
import userController from '../../server/controllers/user';
/*
 * Sanity check to make sure that your server starts up without issues.
 */
test('application server', t => {
  let server;
  const onServer = () => {
    t.ok(server, 'should expose server instance');
    server.close(t.end);
  };
  server = startServer(onServer);
});

test('user endpoint without access token', t => {
  let server;
  const onRequest = (err, res) => {
    t.equal(res.statusCode, 400, 'returns status code 400 without access token');
    server.close(t.end);
  };
  const onServer = () => {
    request({
      method: 'GET',
      url: `http://localhost:${config.port}/user`
    }, onRequest);
  };
  server = startServer(onServer);
});

test('user endpoint with wrong access token', t => {
  let server;
  const onRequest = (err, res) => {
    t.equal(res.statusCode, 401, 'returns status code 401 with wrong access token');
    server.close(t.end);
  };
  const onServer = () => {
    request({
      method: 'GET',
      url: `http://localhost:${config.port}/user`,
      qs: {
        accessToken: 'wrong access token'
      }
    }, onRequest);
  };
  server = startServer(onServer);
});

test('user endpoint with valid access token', t => {
  const accessToken = 'valid access token';
  const expectedResponse = {
    id: '1',
    name: 'Taehoon Kang'
  };
  const fetchUserStub = sinon.stub(userController, 'get', (_, res) => {
    res.send(expectedResponse);
  });
  let server;
  const onRequest = (err, res, user) => {
    t.ok(fetchUserStub.calledOnce, 'fetchUser called');
    fetchUserStub.restore();
    t.equal(res.statusCode, 200, 'returns status code 200 with valid access token');
    t.equal(user.name, expectedResponse.name, 'should return user name');
    server.close(t.end);
  };
  const onServer = () => {
    request({
      method: 'GET',
      url: `http://localhost:${config.port}/user`,
      qs: {accessToken},
      json: true
    }, onRequest);
  };
  server = startServer(onServer);
});
