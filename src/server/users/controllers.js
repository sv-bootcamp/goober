import db from '../database';
import {APIError} from '../ErrorHandler';

export default {
  get(req, res, cb) {
    const key = req.params.id;
    db.get(key, (err, data) => {
      if (err) {
        if (err.notFound) {
          return cb(new APIError(err, {
            statusCode: 400,
            message: 'User was not found'
          }));
        }
        return cb(new APIError(err));
      }
      delete data.password;
      delete data.accountType;
      res.status(200).send(data);
      return cb();
    });
  },
  post() {

  }
};
