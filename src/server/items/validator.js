import validator from 'validator';
import {APIError} from '../ErrorHandler';

export default (req, res, next) => {
  const MIN_TITLE_LENGTH = 0;
  const MAX_TITLE_LENGTH = 200;
  const MIN_LAT = -90;
  const MAX_LAT = 90;
  const MIN_LNG = -180;
  const MAX_LNG = 180;
  const CATEGORIES = ['warning', 'event', 'facility'];
  const key = req.params.id;
  if (key && !(key.startsWith('item-'))) {
    return next(new APIError(new Error('wrong item Id'), 400));
  }
  if (req.body.title && !(typeof req.body.title === 'string'
    && validator.isLength(req.body.title, {
      min: MIN_TITLE_LENGTH,
      max: MAX_TITLE_LENGTH
    }))) {
    return next(new APIError(new Error('wrong item title'), 400));
  }
  if (req.body.lat && !(typeof req.body.lat === 'number'
    && validator.isFloat(req.body.lat.toString(), {
      min: MIN_LAT,
      max: MAX_LAT
    }))) {
    return next(new APIError(new Error('wrong item lat'), 400));
  }
  if (req.body.lng && !(typeof req.body.lng === 'number'
    && validator.isFloat(req.body.lng.toString(), {
      min: MIN_LNG,
      max: MAX_LNG
    }))) {
    return next(new APIError(new Error('wrong item lng'), 400));
  }
  if (req.body.address && !(typeof req.body.address === 'string')) {
    return next(new APIError(new Error('wrong item address'), 400));
  }
  if (req.body.createdDate && !(typeof req.body.createdDate === 'string'
    && validator.isDate(req.body.createdDate))) {
    return next(new APIError(new Error('wrong item createdDate'), 400));
  }
  if (req.body.modifiedDate && !(typeof req.body.modifiedDate === 'string'
    && validator.isDate(req.body.modifiedDate))) {
    return next(new APIError(new Error('wrong item modifiedDate'), 400));
  }
  if (req.body.category && !(typeof req.body.category === 'string'
    && CATEGORIES.indexOf(req.body.category) !== -1)) {
    return next(new APIError(new Error('wrong item category'), 400));
  }
  if (req.body.startTime && !(typeof req.body.startTime === 'string'
    && validator.isDate(req.body.startTime))) {
    return next(new APIError(new Error('wrong item startTime'), 400));
  }
  if (req.body.endTime && !(typeof req.body.endTime === 'string'
    && validator.isDate(req.body.endTime))) {
    return next(new APIError(new Error('wrong item endTime'), 400));
  }

  if (req.validatorTest) {
    return next(req, res);
  }
  return next();
};
