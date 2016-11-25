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
    logger.info('Mock data was successfully stored.');
  });

  /*
    config winston logger
    @TODO it would be better if you configure winston with log monitoring service(eg. cloudwatch)
  */

  const curDate = new Date();
  const curDateStr = `${curDate.getMonth() + 1}-${curDate.getDate()}-${curDate.getFullYear()}`;
  const logFileName = `./logs/created-logfile-${curDateStr}.log`;
  logger.configure({
    transports: [
      new (logger.transports.Console)(),
      new (logger.transports.File)({filename: logFileName})
    ]
  });

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({
    limit: 1024 * 1024 * 10
  }));

  /* request logger */
  app.use((req, res, next) => {
    logger.info(`Request - ${req.method} - PATH : ${req.originalUrl} - ${new Date()}`);
    return next();
  });

  app.use('/javascripts', express.static(path.join(__dirname, '../../dist-client/javascripts')));
  app.use('/stylesheets', express.static(path.join(__dirname, '../../dist-client/stylesheets')));
  app.use('/static', express.static(path.join(__dirname, '../../dist-client/static')));
  app.use('/docs', express.static(path.join(__dirname, '../../doc')));

  app.use('/api', apiRoutes);

  app.use((req, res) => {
    if(!res.headersSent) {
      res.status(404).send('Request > 404 - Page Not Found');
      logger.error(`404 Not Found - ${req.method} - PATH : ${req.originalUrl} - ${new Date()}`);
    }
  });

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

  process.on('uncaughtException', evt => {
    /* eslint-disable no-console */
    logger.error('uncaughtException: ', evt);
    /* eslint-enable */
  });

  const port = process.env.PORT || config.port;
  const server = app.listen(port, cb ? cb : () => {
    /* eslint-disable no-console */
    logger.info(`Server started to run at ${new Date()}`);
    logger.info(`Listening on port ${port}`);
    /* eslint-enable */
  });
  return server;
};
