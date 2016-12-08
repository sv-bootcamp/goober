import db, {fetchPrefix, getPromise, fetchKeys} from '../database';
import {ENTITY, STATE, KeyUtils} from '../key-utils';
import {S3Connector} from '../aws-s3';
import {APIError} from '../ErrorHandler';
import ImageManager from './models';
import {CreatedPostManager} from '../users/models';
import assert from 'assert';

export default {
  get(req, res, cb) {
    const {item, image} = req.query;
    if (item) {
      // get all images of item
      const keys = [];
      const promises = [];
      const checkState = [STATE.ALIVE, STATE.EXPIRED];

      for (const state of checkState) {
        promises.push(new Promise((resolve, reject) => {
          const prefix = KeyUtils.getPrefix(ENTITY.IMAGE, state, item);
          fetchPrefix(prefix, (err, data) => {
            if (err) {
              reject(err);
              return;
            }
            data.map((value) => {
              keys.push(value.key);
            });
            resolve();
          });
        }));
      }
      Promise.all(promises).then(() => {
        const urls = new S3Connector().getImageUrls(keys);
        ImageManager.fetchImage(keys, (err, values) => {
          if (err) {
            return cb(new APIError(err, {
              statusCode: 500,
              message: 'Internal Database Error'
            }));
          }

          for (const url of urls) {
            for (const value of values) {
              if (url.indexOf(value.key) !== -1) {
                value.url = url;
                break;
              }
            }
          }
          res.status(200).send({
            values: values
          });
          return cb();
        });
      }).catch((err) => {
        return cb(new APIError(err, {
          statusCode: 500,
          message: 'Internal Database Error'
        }));
      });
      return;
    } else if (image) {
      // get an images
      ImageManager.fetchImage([image], (errFetch, values) => {
        if (errFetch) {
          cb(new APIError(errFetch, {
            statusCode: 500,
            message: 'Internal Database Error'
          }));
          return;
        }
        const value = values[0];
        value.url = new S3Connector().getImageUrl(image);
        res.status(200).send(value);
        cb();
        return;
      });
      return;
    }
    cb(new APIError(new Error(), {
      statusCode: 400,
      message: 'Bad Request : No query string'
    }));
  },
  post(req, res, cb) {
    assert(req.headers.userKey, 'userKey should be provided.');
    assert(req.body.itemKey, 'itemKey should be provided.');
    const currentTime = new Date();
    const timeHash = KeyUtils.genTimeHash(currentTime);
    const key = `${ENTITY.IMAGE}-${timeHash}`;
    const idxKey = KeyUtils.getIdxKey(ENTITY.IMAGE, timeHash, req.body.itemKey);
    const s3 = new S3Connector();

    const opt = {key, body: req.body.image};
    new Promise((resolve, reject) => {
      s3.putImage(opt, (err) => {
        return (err) ? reject(err) : resolve();
      });
    })
    .then(() => {
      const url = s3.getImageUrl(key);
      return new Promise((resolve, reject) => {
        const image = {
          key,
          url,
          userKey: req.headers.userKey,
          itemKey: req.body.itemKey,
          caption: req.body.caption,
          createdDate: currentTime.toISOString()
        };
        const idxImage = {key};
        const ops = [
          {type: 'put', key, value: image},
          {type: 'put', key: idxKey, value: idxImage}
        ];
        db.batch(ops, (err) => {
          return (err) ? reject(err) : resolve(image);
        });
      });
    })
    .then((image) => {
      const createdPost = {
        entity: ENTITY.IMAGE,
        itemKey: image.itemKey,
        imageKey: image.key
      };
      return CreatedPostManager.addPost(image.userKey, createdPost, timeHash);
    })
    .then(() => {
      res.status(200).send({message: 'success', data: key });
      return cb();
    })
    .catch((err) => {
      return cb(new APIError(err, {statusCode: err.statusCode, message: err.message}));
    });
  },
  remove(req, res, cb) {
    const {userKey} = req.headers;
    const imageKey = req.params.id;
    assert(userKey, 'user-key should be provided');
    assert(imageKey, 'image-key should be provided');

    let itemKey;
    let imageIndexKey;
    let createdPostKey;
    let imageIndexValue;
    let createdPostValue;

    const promises = [];

    getPromise(imageKey).then((value) => {
      // make keys
      itemKey = value.itemKey;
      const timeHash = imageKey.slice(6);
      imageIndexKey = KeyUtils.getIdxKey(ENTITY.IMAGE, timeHash, itemKey);
      createdPostKey = KeyUtils.getIdxKey(ENTITY.CREATED_POST, timeHash, userKey);
    }).then(() => {
      // save values
      return getPromise(imageIndexKey).then((value) => {
        imageIndexValue = value;
        return getPromise(createdPostKey);
      }).then((value) => {
        createdPostValue = value;
      });
    }).then(() => {
      console.log('here2');
      // delete ALIVE state
      const opts = [
        { type: 'del', key: imageIndexKey },
        { type: 'del', key: createdPostKey }
      ];
      return new Promise((resolve, reject) => {
        db.batch(opts, (err) => {
          return err ? reject(err) : resolve();
        });
      });
    }).then(() => {
      // add REMOVED state
      function replaceAt(str, index, char) {
        return str.substr(0, index) + char + str.substr(index + char.length);
      }
      const removedImageIndexKey =
        replaceAt(imageIndexKey, imageIndexKey.indexOf('0'), STATE.REMOVED);
      const removedCreatedPostKey =
        replaceAt(createdPostKey, createdPostKey.indexOf('0'), STATE.REMOVED);
      const opts = [
        { type: 'put', key: removedImageIndexKey, value: imageIndexValue },
        { type: 'put', key: removedCreatedPostKey, value: createdPostValue }
      ];
      return new Promise((resolve, reject) => {
        db.batch(opts, (err) => {
          return err ? reject(err) : resolve();
        });
      });
    }).then(() => {
      // count image of item
      const prefixes = [];
      prefixes.push(KeyUtils.getPrefix(ENTITY.IMAGE, STATE.ALIVE, itemKey));
      prefixes.push(KeyUtils.getPrefix(ENTITY.IMAGE, STATE.EXPIRED, itemKey));

      prefixes.map((prefix) => {
        promises.push(new Promise((resolve, reject) => {
          fetchKeys(prefix, (err, keys) => {
            if (err) {
              return reject(err);
            }
            return resolve(keys.length);
          });
        }));
      });
    // }).all(promises).then((keyLengthList) => {
    //   // Remove item, if it is needed
    //   return new Promise((resolve, reject) => {
    //     const totalLength = keyLengthList.reduce((acc ,num) => {
    //       return acc + num;
    //     });
    //     if (totalLength == 0) {
    //       getPromise(itemKey).then(value => {
    //
    //       })
    //     }
    //     resolve();
    //   });
    }).then(() => {
      res.sendStatus(200);
      cb();
    }).catch((err) => {
      console.log(err); // disable-eslint no-console
      cb(new APIError(err, {statusCode: 400, message: err.message}));
    });
  }
};
