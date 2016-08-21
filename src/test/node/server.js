//import request from 'request';
import test from 'tape';
import startServer from '../../server';
/*
 * Sanity check to make sure that your server starts up without issues.
 */
test('application server', t => {
  let server;
  const onServer = () => {
    t.ok(server, 'should expose server instance');
    //t.ok(server.connection, 'should connect');
    server.close(t.end);
  };
  server = startServer(onServer);
});
