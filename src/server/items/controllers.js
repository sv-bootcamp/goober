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
  }
};
