import db from '../database';

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
        res.status(200);
        res.send({items:items});
        return cb({items:items});
      }
      res.status(500);
      res.send({
        error: 'database error'
      });
      return cb(err);
    })
    .on('close', () => {
      if (items.length !== 0 ) {
        res.send({items:items});
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
          res.status(400);
          res.send({
            error: 'Item was not found.'
          });
          return cb(err);
        }
        res.status(500);
        res.send({
          error: 'database error'
        })
        return cb(err);
      }
      res.status(200);
      res.send(value);
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
  }
};
