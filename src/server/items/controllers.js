import db from '../database';
import uuid from 'uuid4';
import {APIError} from '../ErrorHandler';

export default {
  getAll: (req, res, cb) => {
    const items = [];
    let error;
    db.createReadStream({
      start: 'item-',
      end: 'item-\xFF'
    }).on('data', (data) => {
      data.value.id = data.key;
      items.push(data.value);
    }).on('error', (err) => {
      error = err;
      return cb(new APIError(err));
    })
    .on('close', () => {
      if (!error) {
        res.status(200).send({items});
        cb();
      }
    });
  },
  getById: (req, res, cb) => {
    const key = req.params.id;
    db.get(key, (err, value) => {
      if (err) {
        if (err.notFound) {
          res.status(400).send({
            error: 'Item was not found.'
          });
          return cb();
        }
        res.status(500).send({
          error: 'database error'
        });
        return cb();
      }
      value.id = key;
      res.status(200).send(value);
      return cb();
    });
  },
  remove: (req, res, cb) => {
    const key = req.params.id;
    db.del(key, (err) => {
      if (err) {
        if(err.notFound){
          return cb(new APIError(err, {
            statusCode: 400,
            message: 'Bad Request, No data'
          }));
        }
        return cb(new APIError(err, {
          statusCode: 500,
          message: 'Internal Database Error'
        }));
      }
      res.status(200).send({
        message: 'success'
      });
      return cb();
    });
  },
  removeAll: (req, res, cb) => {
    const errorList = [];
    db.createReadStream({
      start: 'item-',
      end: 'item-\xFF'
    }).on('data', (data) => {
      db.del(data.key, (err) => {
        if (err) {
          errorList.push(err);
        }
      });
    }).on('close', () => {
      if (errorList.length > 0) {
        return cb(new APIError(errorList[0], {
          statusCode: 500,
          message: 'Internal Database Error'
        }));
      }
      res.status(200).send({
        message: 'success'
      });
      return cb();
    });
  },
  add: (req, res, cb) => {
    const itemId = `item-${uuid()}`;
    db.put(itemId, req.body, (itemErr) => {
      if (itemErr) {
        return cb(new APIError(itemErr));
      }
      res.status(200).send({
        message: 'success',
        data: itemId
      });
      return cb();
    });
  },
  modify: (req, res, cb) => {
    const key = req.params.id;
    db.get(key, (getErr) => {
      if (getErr) {
        if (getErr.notFound) {
          return cb(new APIError(getErr, {
            statusCode: 400,
            message: getErr
          }));
        }
        return cb(new APIError(getErr));
      }
      const value = req.body;
      return db.put(key, value, (itemErr) => {
        if (itemErr) {
          return cb(new APIError(itemErr));
        }
        res.status(200).send({
          message: 'success',
          data: value
        });
        return cb();
      });
    });
  }
};


