import express from 'express';
import path from 'path';
import config from 'config';
import reactRoutes from './react-routes';
import apiRoutes from './routes/api-routes';
import bodyParser from 'body-parser';
import {initMock} from './database';
export default (cb) => {
  const app = express();
  // Please remove it when it's realsed
  initMock().then(()=>{
    /* eslint-disable no-console */
    console.log('Mock data was successfully stored.');
    /* eslint-enable */
  });
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use('/javascripts', express.static(path.join(__dirname, '../../dist-client/javascripts')));
  app.use('/stylesheets', express.static(path.join(__dirname, '../../dist-client/stylesheets')));
  app.use('/static', express.static(path.join(__dirname, '../../dist-client/static')));
  app.use('/docs', express.static(path.join(__dirname, '../../doc')));

  app.use('/api', apiRoutes);
  app.use(reactRoutes);

  // development error handler
  // will print stacktrace
  if (app.get('env') !== 'PROD') {
    app.use((err, req, res) => {
      res.status(err.status || 500);
      /* eslint-disable no-console */
      console.log(err, err.message);
      /* eslint-enable */
    });
  }

  // example of handling 404 pages
  app.get('*', (req, res) => {
    res.status(404).send('server/index.js > 404 - Page Not Found');
  });

  // global error catcher, need four arguments
  app.use((err, req, res) => {
    /* eslint-disable no-console */
    console.error('Error on request %s %s', req.method, req.url);
    console.error(err.stack);
    /* eslint-enable */
    res.status(500).send('Server error');
  });

  process.on('uncaughtException', evt => {
    /* eslint-disable no-console */
    console.log('uncaughtException: ', evt);
    /* eslint-enable */
  });

  const port = process.env.PORT || config.port;
  const server = app.listen(port, cb ? cb : () => {
    /* eslint-disable no-console */
    console.log(`Listening on port ${port}`);
    /* eslint-enable */
  });
  return server;
};
