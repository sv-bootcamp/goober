import db, {fetchValues, getPromise} from '../database';
import {ENTITY, STATE, KeyUtils} from '../key-utils';
import {S3Connector} from '../aws-s3';
import {APIError, NotFoundError} from '../ErrorHandler';
import ImageManager from './models';
import UserManager, {CreatedPostManager} from '../users/models';
import {ItemManager} from '../items/models';
import assert from 'assert';

// add REMOVED state
function replaceAt(str, index, char) {
  // TODO: Refactoring : This function is duplicated with replaceState
  return str.substr(0, index) + char + str.substr(index + char.length);
}

export default {
  getById(req, res, cb) {
    const imageKey = req.params.id;
    // get an image
    getPromise(imageKey)
    .then((value)=>{
      value.url = new S3Connector().getImageUrl(imageKey);
      res.status(200).send(value);
      cb();
      return;
    })
    .catch((err)=>{
      if (err.notFound) {
        cb(new APIError(new NotFoundError(), 400));
        return;
      }
      cb(new APIError(err));
      return;
    });
  },
  getAll(req, res, cb) {
    const {item} = req.query;
    if (item) {
      // get all images of item
      const s3 = new S3Connector();
      const checkState = [STATE.ALIVE, STATE.EXPIRED];
      ImageManager.getImageKeys(item, checkState)
        .then(fetchValues)
        .then(values => UserManager.fetchUserProfiles(s3.fetchImageUrls(values)))
        .then(values => {
          res.status(200).send({values});
          cb();
        }).catch(err => cb(new APIError(err)));
      return;
    }
    cb(new APIError(new Error('Bad Request : No query string'), 400));
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
      res.status(200).send({
        message: 'success',
        data: {
          itemKey: req.body.itemKey,
          imageKey: key
        }
      });
      return cb();
    })
    .catch(err => cb(new APIError(err)));
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
      return ImageManager.countImageOfItem(itemKey, STATE.ALIVE, STATE.EXPIRED);
    }).then((numOfImages) => {
      // Remove item, if it is needed
      return new Promise((resolve) => {
        if (numOfImages > 0) {
          return resolve();
        }
        return ItemManager.removeItem(itemKey);
      });
    }).then(() => {
      res.status(200).send({ message: 'success', data: `${imageKey}` });
      cb();
    }).catch(err => cb(new APIError(err, 400)));
  }
};
