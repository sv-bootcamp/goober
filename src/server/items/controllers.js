import db from '../database';
import uuid from 'uuid4';

export default {
  getAll: (req, res, cb) => {
    const items = [];
    db.createReadStream({
      start: 'item1',
      end: 'item' + '\xFF'
    }).on('data', (data) => {
      items.push(data.value);
    }).on('error', (err) => {
      if (err.notFound) {
        res.status(200).send({items});
        return cb();
      }
      res.status(500).send({error: 'database error'});
      return cb();
    })
    .on('close', () => {
      if (items.length !== 0) {
        res.send({items});
        cb();
      }
    });
  },
  getById: (req, res, cb) => {
    const {id} = req.params;
    const key = `item${id}`;
    db.get(key, (err, value) => {
      if (err) {
        if (err.notFound) {
          res.status(400).send({error: 'Item was not found.'});
          return cb();
        }
        res.status(500).send({error: 'database error'});
        return cb();
      }
      res.status(200).send(value);
      return cb();
    });
  },
  remove: (req, res, cb) => {
    const key = req.params.id;
    db.del(key, (err) => {
      if (err) {
        res.status(400).send({
          message: err
        });
        return cb();
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
          errorList.push(data.key);
        }
      });
    }).on('close', () => {
      if (errorList.length > 0) {
        res.status(500).send({
          error: errorList
        });
        return cb();
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
        res.status(500).send({error: itemErr});
        return cb();
      }
      res.status(200).send({message: 'success'});
      return cb(itemId);
    });
  },
  modify: (req, res, cb) => {
    const key = req.params.id;
    db.get(key, (getErr) => {
      if (getErr) {
        if (getErr.notFound) {
          res.status(400).send({error: getErr.notFound});
          return cb();
        }
        res.status(500).send({error: getErr});
        return cb();
      }
      return db.put(key, req.body, (itemErr) => {
        if (itemErr) {
          res.status(500).send({error: itemErr});
          return cb();
        }
        res.status(200).send({message: 'success'});
        return cb(req.body.address);
      });
    });
  }
};


