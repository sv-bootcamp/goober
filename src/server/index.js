import express from 'express';
import path from 'path';
import config from 'config';
import apiRoutes from './routes/api-routes';
import bodyParser from 'body-parser';
import {initMock} from './database';
import logger from 'winston';
export default (cb) => {
  const app = express();
  // Please remove it before you release.
  initMock().then(()=>{
    /* eslint-disable no-console */
    logger.info('Mock data was successfully stored.');
    /* eslint-enable */
  });
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({
    limit: 1024 * 1024 * 10
  }));

  /* request logger */
  app.use((req, res, next) => {
    logger.info(`${req.method} - PATH : ${req.originalUrl} - ${new Date()}`);
    return next();
  });

  app.use('/javascripts', express.static(path.join(__dirname, '../../dist-client/javascripts')));
  app.use('/stylesheets', express.static(path.join(__dirname, '../../dist-client/stylesheets')));
  app.use('/static', express.static(path.join(__dirname, '../../dist-client/static')));
  app.use('/docs', express.static(path.join(__dirname, '../../doc')));

  app.use('/api', apiRoutes);

  // development error handler
  // will print stacktrace
  if (app.get('env') !== 'PROD') {
    app.use((err, req, res) => {
      res.status(err.status || 500);
      /* eslint-disable no-console */
      logger.error(err, err.message);
      /* eslint-enable */
    });
  }

  // example of handling 404 pages
  app.get('*', (req, res) => {
    res.status(404).send('server/index.js > 404 - Page Not Found');
  });

  process.on('uncaughtException', evt => {
    /* eslint-disable no-console */
    logger.error('uncaughtException: ', evt);
    /* eslint-enable */
  });

  const port = process.env.PORT || config.port;
  const server = app.listen(port, cb ? cb : () => {
    /* eslint-disable no-console */
    logger.info(`Listening on port ${port}`);
    /* eslint-enable */
  });
  return server;
};
