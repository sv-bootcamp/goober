import db from '../database';

export default {
  db_get: (req, res, next) => { // eslint-disable-line camelcase
    const prefix = req.query.prefix ? req.query.prefix : '';
    const collection = [];

    db.createReadStream({
      start: `${prefix}`,
      end: `${prefix}\xFF`
    })
    .on('data', (val) => {
      collection.push(val);
    })
    .on('error', (err) => {
      res.status(500).send(err);
      return next();
    })
    .on('close', () => {
      if (res.headersSent) {
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
        res.status(500).send(err);
        return next();
      }
      res.sendStatus(200);
      return next();
    });
  },

  db_delete: (req, res, next) => {  // eslint-disable-line camelcase
    const key = req.params.id;
    db.del(key, (err) => {
      if (err) {
        res.status(500).send(err);
        return next();
      }
      res.sendStatus(200);
      return next();
    });
  }
};
