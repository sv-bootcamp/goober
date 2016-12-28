import db, {fetchPrefix} from '../database';
import {APIError} from '../ErrorHandler';
import {KeyUtils, STATE, ENTITY, CATEGORY} from '../key-utils';
import ItemManager, {STATE_STRING} from './models';
import {S3Connector, IMAGE_SIZE_PREFIX} from '../aws-s3';
import {CreatedPostManager} from '../../server/users/models';

export default {
  getAll: (req, res, cb) => {
    const {lat, lng, zoom, isThumbnail} = req.query;
    // getByArea
    if (lat && lng && zoom) {
      const precision = KeyUtils.calcPrecisionByZoom(Number(zoom));
      const keys = KeyUtils.getKeysByArea(lat, lng, precision);
      const {userKey} = req.headers;
      const promises = [];
      const items = [];
      const s3Connector = new S3Connector();
      for (const key of keys) {
        promises.push(new Promise((resolve, reject) => {
          // @TODO we have to limit the number of items.
          const imagePromises = [];
          db.createReadStream({
            start: `${ENTITY.ITEM}-${STATE.ALIVE}-${key}-`,
            end: `${ENTITY.ITEM}-${STATE.ALIVE}-${key}-\xFF`
          }).on('data', (data) => {
            db.get(data.value.key, (err, refData) => {
              if (err) {
                reject(err);
                return;
              }
              ItemManager.validChecker(refData, (valid) => {
                if (valid) {
                  imagePromises.push(new Promise((imageResolve, imageReject) => {
                    const images = [];
                    db.createReadStream({
                      start: `${ENTITY.IMAGE}-${STATE.ALIVE}-${refData.key}-`,
                      end: `${ENTITY.IMAGE}-${STATE.ALIVE}-${refData.key}-\xFF`
                    }).on('data', (imageIndex) => {
                      images.push(imageIndex.value.key);
                    }).on('error', (imageErr) => {
                      imageReject(imageErr);
                    }).on('close', () => {
                      if (isThumbnail === 'true') {
                        refData.imageUrls =
                          s3Connector.getPrefixedImageUrls(images, IMAGE_SIZE_PREFIX.THUMBNAIL);
                      } else {
                        refData.imageUrls = s3Connector.getImageUrls(images);
                      }
                      items.push(refData);
                      imageResolve();
                    });
                  }));
                }
              });
            });
          }).on('error', (err) => {
            reject(err);
          }).on('close', () => {
            Promise.all(imagePromises).then(()=>{
              resolve();
            }).catch((err)=>{
              reject(err);
            });
          });
        }));
      }
      Promise.all(promises)
      .then(() => {
        return ItemManager.fillIsSaved(userKey, items);
      })
      .then(() => {
        res.status(200).send({
          items
        });
        return cb();
      }).catch((err) => {
        if (err.notFound) {
          res.status(200).send({
            items
          });
          return cb();
        }
        return cb(new APIError(err));
      });
      return;
    }
    const items = [];
    let error;
    db.createReadStream({
      start: `${ENTITY.ITEM}-`,
      end: `${ENTITY.ITEM}-\xFF`
    }).on('data', (data) => {
      items.push(data.value);
    }).on('error', (err) => {
      error = err;
      return cb(new APIError(err));
    }).on('close', () => {
      if (!error) {
        res.status(200).send({items});
        cb();
      }
    });
  },
  getById: (req, res, cb) => {
    const key = req.params.id;
    db.get(key, (errGet, value) => {
      if (errGet) {
        if (errGet.notFound) {
          cb(new APIError(errGet, 400));
          return;
        }
        cb(new APIError(errGet));
        return;
      }
      fetchPrefix(`${ENTITY.IMAGE}-${STATE.ALIVE}-${key}-`, (err, values) => {
        if (err) {
          cb(new APIError(err));
          return;
        }

        const keys = [];
        values.map((obj) => {
          keys.push(obj.key);
        });
        const conn = new S3Connector();
        const imageUrls = conn.getImageUrls(keys);
        value.id = key;
        value.imageUrls = imageUrls;
        res.status(200).send(value);
        cb();
        return;
      });
    });
  },
  remove: (req, res, cb) => {
    const TARGET_STATE = [STATE.ALIVE, STATE.EXPIRED];
    const key = req.params.id;
    const timeHash = KeyUtils.parseTimeHash(key);
    return db.get(key, (getErr, item) => {
      if (getErr) {
        if (getErr.notFound) {
          return cb(new APIError(getErr, 400));
        }
        return cb(new APIError(getErr));
      }
      item.state = STATE_STRING[STATE.REMOVED];
      const idxKeys = KeyUtils.getIdxKeys(item.lat, item.lng, timeHash, STATE.REMOVED);
      const ops = [
        {type: 'put', key: key, value: item}
      ];
      idxKeys.map((idxKey)=>{
        ops.push({type: 'put', key: idxKey, value: {key: key}});
        TARGET_STATE.map(state=>{
          ops.push({type: 'del', key: KeyUtils.replaceState(idxKey, state)});
        });
      });
      return db.batch(ops, (itemErr) => {
        if (itemErr) {
          return cb(new APIError(itemErr));
        }
        const createdPostKey = CreatedPostManager.genKey(item.userKey, item.key, STATE.ALIVE);
        return CreatedPostManager.deletePost(createdPostKey)
        .then(() => {
          res.status(200).send({
            message: 'success'
          });
          return cb();
        })
        .catch(err => cb(new APIError(err)));
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
        return cb(new APIError(errorList[0]));
      }
      res.status(200).send({
        message: 'success'
      });
      return cb();
    });
  },
  add: (req, res, cb) => {
    const currentTime = new Date();
    const timeHash = KeyUtils.genTimeHash(currentTime);
    const key = `${ENTITY.ITEM}-${timeHash}`;
    const idxKeys = KeyUtils.getIdxKeys(req.body.lat, req.body.lng, timeHash);
    const imageKey = `${ENTITY.IMAGE}-${timeHash}`;
    const imageIdxKey = KeyUtils.getIdxKey(ENTITY.IMAGE, timeHash, key);
    const item = {
      key,
      title: req.body.title,
      lat: req.body.lat,
      lng: req.body.lng,
      userKey: req.headers.userKey,
      address: req.body.address,
      category: req.body.category,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      state: STATE_STRING[STATE.ALIVE],
      createdDate: currentTime.toISOString(),
      modifiedDate: currentTime.toISOString()
    };
    const image = {
      key: imageKey,
      userKey: req.headers.userKey,
      caption: req.body.caption,
      createdDate: currentTime.toISOString()
    };
    const createdPost = {
      entity: ENTITY.ITEM,
      itemKey: key,
      imageKey
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
    .then(CreatedPostManager.addPost(req.headers.userKey, createdPost, timeHash))
    .then(() => {
      res.status(200).send({
        message: 'success',
        data: {
          itemKey: key,
          imageKey
        }
      });
      return cb();
    })
    .catch(err => cb(new APIError(err)));
  },
  modify: (req, res, cb) => {
    const key = req.params.id;
    db.get(key, (getErr, value) => {
      if (getErr) {
        if (getErr.notFound) {
          return cb(new APIError(getErr, 400));
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
