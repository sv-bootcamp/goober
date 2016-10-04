import db from '../database';
import uuid from 'uuid4';
import {APIError} from '../ErrorHandler';
import geohash from 'ngeohash';

const VALID_ITEM_CODE = 1;
const GEOHASH_LENGTH = 8;
const MAX_TIMESTAMP = 10000000000000;


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
    const GEOHASH_START_POS = 5;
    const GEOHASH_END_POS = 12;
    const UUID_START_POS = 14;
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
      const itemTimeStamp = MAX_TIMESTAMP - Number(new Date(item.createdDate));
      const ops = [];
      for (let i = 0; i < GEOHASH_LENGTH; i = i + 1) {
        const ghSubstr = itemGeohash.substring(0, i + 1);
        const deletedItemId = `item-2-${ghSubstr}-${itemTimeStamp}-${itemUuid}`;
        ops.push({type: 'put', key: deletedItemId, value: {ref: key}});
        for (let j = 0; j < 2; j = j + 1) {
          const itemIndexingId = `item-${j}-${ghSubstr}-${itemTimeStamp}-${itemUuid}`;
          ops.push({type: 'del', key: itemIndexingId});
        }
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
  add: (req, res, cb) => {
    const geoHashKey = geohash.encode(req.body.lat, req.body.lng, GEOHASH_LENGTH);
    const uuidKey = uuid();
    const itemId = `item-${geoHashKey}-${uuidKey}`;
    const createdDate = new Date();
    req.body.createdDate = createdDate.toISOString();
    req.body.modifiedDate = createdDate.toISOString();
    const oppositeTimeStamp = MAX_TIMESTAMP - Number(createdDate);
    const ops = [
      { type: 'put', key: itemId, value: req.body}
    ];
    for (let i = 0; i < GEOHASH_LENGTH; i = i + 1) {
      const ghSubstr = geoHashKey.substr(0, i + 1);
      const itemIndexingId = `item-${VALID_ITEM_CODE}-${ghSubstr}-${oppositeTimeStamp}-${uuidKey}`;
      ops.push({type: 'put', key: itemIndexingId, value: {ref: itemId}});
    }
    db.batch(ops, (itemErr) => {
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


