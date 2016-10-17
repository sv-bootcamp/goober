import db from '../database';
import {APIError} from '../ErrorHandler';
import {KeyUtils, Timestamp, DEFAULT_PRECISON, GEOHASH_START_POS, GEOHASH_END_POS,
        UUID_START_POS, STATE, ENTITY, CATEGORY} from '../key-utils';
import {S3Connector} from '../aws-s3';

export default {
  getAll: (req, res, cb) => {
    const {lat, lng, zoom} = req.query;
    if (lat && lng && zoom) {
      const precision = KeyUtils.calcPrecisionByZoom(Number(zoom));
      const keys = KeyUtils.getKeysByArea(lat, lng, precision);
      const promises = [];
      const items = [];
      for (const key of keys) {
        promises.push(new Promise((resolve, reject) => {
          // @TODO we have to limit the number of items.
          db.createReadStream({
            start: `item-${STATE.ALIVE}-${key}-`,
            end: `item-${STATE.ALIVE}-${key}-\xFF`
          }).on('data', (data) => {
            db.get(data.value.ref, (err, refData) => {
              if (!err) {
                refData.id = data.value.ref;
                items.push(refData);
              }
            });
          }).on('error', (err) => {
            reject(err);
          })
          .on('close', () => {
            resolve();
          });
        }));
      }
      Promise.all(promises).then(() => {
        res.status(200).send({
          items
        });
        cb();
      }).catch((err) => {
        if (err.notFound) {
          res.status(200).send({
            items
          });
          return cb();
        }
        return cb(new APIError(err, {
          statusCode: 500,
          message: 'Internal Database Error'
        }));
      });
      return;
    }
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
    return;
  },
  getById: (req, res, cb) => {
    const key = req.params.id;
    db.get(key, (err, value) => {
      if (err) {
        if (err.notFound) {
          return cb(new APIError(err, {
            statusCode: 400,
            message: 'Item was not found'
          }));
        }
        return cb(new APIError(err));
      }
      value.id = key;
      res.status(200).send(value);
      return cb();
    });
  },
  remove: (req, res, cb) => {
    const key = req.params.id;
    const itemGeohash = key.substring(GEOHASH_START_POS, GEOHASH_END_POS + 1);
    const itemUuid = key.substring(UUID_START_POS, key.length);
    db.get(key, (getErr, value) => {
      if (getErr) {
        if (getErr.notFound) {
          return cb(new APIError(getErr, {
            statusCode: 400,
            message: 'Item was not found'
          }));
        }
        return cb(new APIError(getErr));
      }
      const item = value;
      const TimeStamp = new Timestamp(item.createdDate).getTimestamp();
      const ops = [];
      for (let i = 0; i < DEFAULT_PRECISON; i = i + 1) {
        const ghSubstr = itemGeohash.substring(0, i + 1);
        const deletedItemId = `item-${STATE.REMOVED}-${ghSubstr}-${TimeStamp}-${itemUuid}`;
        ops.push({
          type: 'put',
          key: deletedItemId,
          value: {ref: key}
        });
        ops.push({
          type: 'del',
          key: `item-${STATE.ALIVE}-${ghSubstr}-${TimeStamp}-${itemUuid}`
        });
        ops.push({type: 'del', key: `item-${STATE.EXPIRED}-${ghSubstr}-${TimeStamp}-${itemUuid}`});
      }
      return db.batch(ops, (itemErr) => {
        if (itemErr) {
          return cb(new APIError(itemErr));
        }
        res.status(200).send({
          message: 'success'
        });
        return cb();
      });
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
  addItem: (req, res, cb) => {
    const currentTime = new Date();
    const timeHash = KeyUtils.genTimeHash(currentTime);
    const key = `${ENTITY.ITEM}-${timeHash}`;
    const idxKeys = KeyUtils.getIdxKeys(req.body.lat, req.body.lng, timeHash);
    const imageKey = `${ENTITY.IMAGE}-${timeHash}`;
    const imageIdxKey = KeyUtils.getIdxKey(ENTITY.IMAGE, timeHash, key);
    const item = {
      key: key,
      title: req.body.title,
      lat: req.body.lat,
      lng: req.body.lng,
      address: req.body.address,
      category: req.body.category,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      createdDate: currentTime.toISOString(),
      modifiedDate: currentTime.toISOString()
    }
    const image = {
      key: imageKey,
      userKey: item.userKey,
      caption: item.caption,
      createdDate: currentTime.toISOString()
    };
    const opt = {key: imageKey, body: req.body.image};
    new Promise((resolve, reject) => {
      new S3Connector().putImage(opt, (err) => {
        return (err) ? reject(err) : resolve();
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        if (item.category !== CATEGORY.FACILITY && !item.startTime) {
          item.startTime = item.createdDate;
        }
        const ops = [
          {type: 'put', key: key, value: item},
          {type: 'put', key: imageKey, value: image},
          {type: 'put', key: imageIdxKey, value: {key: imageKey}}
        ];
        idxKeys.map((idxKey) => {
          ops.push({type: 'put', key: idxKey, value: {key: key}});
        });
        db.batch(ops, (err) => {
          return (err) ? reject(err) : resolve();
        });
      });
    })
    .then(() => {
      res.status(200).send({message: 'success', data: key });
      return cb();
    })
    .catch((err) => {
      return cb(new APIError(err, {statusCode: err.statusCode, message: err.message}));
    });
  },
  modify: (req, res, cb) => {
    const key = req.params.id;
    db.get(key, (getErr, value) => {
      if (getErr) {
        if (getErr.notFound) {
          return cb(new APIError(getErr, {
            statusCode: 400,
            message: getErr
          }));
        }
        return cb(new APIError(getErr));
      }
      req.body.createdDate = value.createdDate;
      req.body.modifiedDate = new Date().toISOString();
      const newValue = req.body;
      return db.put(key, newValue, (itemErr) => {
        if (itemErr) {
          return cb(new APIError(itemErr));
        }
        res.status(200).send({
          message: 'success',
          data: newValue
        });
        return cb();
      });
    });
  }
};

