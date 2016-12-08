import express from 'express';
import path from 'path';
import config from 'config';
import apiRoutes from './routes/api-routes';
import bodyParser from 'body-parser';
import {handle404} from './ErrorHandler';
import logger from 'winston';

export default (cb) => {
  const app = express();
  /*
    config winston logger
    @TODO it would be better if you configure winston with log monitoring service(eg. cloudwatch)
  */

  const curDate = new Date();
  const curDateStr = `${curDate.getDate()}-${curDate.getMonth() + 1}-${curDate.getFullYear()}`;
  const logFileName = `./logs/${curDateStr}.log`;
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

  app.get('/ping', (req, res) => {
    res.sendStatus(200);
  });
  app.use('/javascripts', express.static(path.join(__dirname, '../../dist-client/javascripts')));
  app.use('/stylesheets', express.static(path.join(__dirname, '../../dist-client/stylesheets')));
  app.use('/static', express.static(path.join(__dirname, '../../dist-client/static')));
  app.use('/docs', express.static(path.join(__dirname, '../../doc')));
  app.use('/api', apiRoutes);
  // @TODO: make root page

  app.use('*', handle404);

  // development error handler
  // will print stacktrace
  if (app.get('env') !== 'PROD') {
    app.use((err, req, res) => {
      res.status(err.status || 500);
      logger.error(err, err.message);
    });
  }

  process.on('uncaughtException', evt => {
    logger.error('uncaughtException: ', evt);
  });

  const port = process.env.PORT || config.port;
  const server = app.listen(port, cb ? cb : () => {
    logger.info(`Server started to run at ${new Date()}`);
    logger.info(`Listening on port ${port}`);
  });
  return server;
};
