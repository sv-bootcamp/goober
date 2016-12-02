import db from '../database';
import {APIError} from '../ErrorHandler';

export default {
  db_get: (req, res, next) => { // eslint-disable-line camelcase
    const prefix = req.query.prefix ? req.query.prefix : '';
    const collection = [];
    let error;

    db.createReadStream({
      start: `${prefix}`,
      end: `${prefix}\xFF`
    })
    .on('data', (val) => {
      collection.push(val);
    })
    .on('error', (err) => {
      error = err;
      return next(new APIError(err));
    })
    .on('close', () => {
      if (error) {
        return;
      }
      res.send(collection);
      next();
      return;
    });
  },

  db_post: (req, res, next) => {  // eslint-disable-line camelcase
    const {key, value} = req.body;
    db.put(key, value, (err) => {
      if (err) {
        return next(new APIError(err));
      }
      res.sendStatus(200);
      return next();
    });
  },

  db_delete: (req, res, next) => {  // eslint-disable-line camelcase
    const key = req.params.id;
    db.del(key, (err) => {
      if (err) {
        return next(new APIError(err));
      }
      res.sendStatus(200);
      return next();
    });
  }
};
