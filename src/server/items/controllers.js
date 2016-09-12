import db from '../database';

export default {
  getAll: (req, res, cb) => {
    const items = [];
    db.createReadStream({
      start: 'item-',
      end: 'item-' + '\xFF'
    }).on('data', (data) => {
      data.value.id = data.key;
      items.push(data.value);
    }).on('error', (err) => {
      if (err.notFound) {
        res.status(200).send({items});
        return cb();
      }
      res.status(500).send({
        error: 'database error'
      });
      return cb();
    })
    .on('close', () => {
      if (items.length !== 0) {
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
      res.status(200).send(value);
      return cb();
    });
  },
  remove: (req, res, cb) => {
    const key = 'item' + req.params.id;
    db.del(key, (err) => {
      if (err) {
        res.status(400);
        res.send({
          message: err
        });
      } else {
        res.status(200);
        res.send({
          message: 'success'
        });
      }
      cb();
    });
  },

  removeAll: (req, res, cb) => {
    const errorList = [];
    db.createReadStream({
      start: 'item1',
      end: 'item' + '\xFF'
    }).on('data', (data) => {
      db.del(data.key, (err) => {
        if (err) {
          errorList.push(data.key);
        }
      });
    }).on('close', () => {
      if (errorList.length > 0) {
        res.status(500);
        res.send({
          error: errorList
        });
      } else {
        res.status(200);
        res.send({
          message: 'success'
        });
      }
      return cb();
    });
  }
};
