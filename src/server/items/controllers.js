import db from '../database';

export default {
  getAll: (req, res, cb) => {
    const result = {};
    db.createReadStream({
      start: 'item1',
      end: 'item' + '\xFF'
    }).on('data', (data) => {
      result[data.key] = data.value;
    }).on('close', () => {
      res.send(result);
      cb();
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
