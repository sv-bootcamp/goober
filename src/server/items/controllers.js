import db from '../database';


export default {
  getAll: (res, cb) => {
    let result = {};
    db.createReadStream({
      start: 'item1',
      end: 'item' + '\xFF'
    }).on('data', (data) => {
      result[data.key] = data.value;
    }).on('close', () => {
      res.send(result);
      if (cb) {
        cb();
      }
    });
  }
};
