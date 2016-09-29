import validator from 'validator';
import {APIError} from '../ErrorHandler';

export default (req, res, next) => {
  const MIN_DECSRIPSION_LENGTH = 0;
  const MAX_DECSRIPSION_LENGTH = 200;
  const MIN_LAT = -90;
  const MAX_LAT = 90;
  const MIN_LNG = -180;
  const MAX_LNG = 180;
  const CATEGORIES = ['Warning', 'Events', 'Facilitates'];
  const key = req.params.id;
  if (key && !(key.startsWith('item-')
      && validator.isUUID(key.substr(5, key.length)))) {
    return next(new APIError(new Error(), {
      statusCode: 400,
      message: 'wrong item Id'
    }));
  }
  if (req.body.description && !(typeof req.body.description === 'string'
    && validator.isLength(req.body.description, {
      min: MIN_DECSRIPSION_LENGTH,
      max: MAX_DECSRIPSION_LENGTH
    }))) {
    return next(new APIError(new Error(), {
      statusCode: 400,
      message: 'wrong item description'
    }));
  }
  if (req.body.lat && !(typeof req.body.lat === 'number'
    && validator.isFloat(req.body.lat.toString(), {
      min: MIN_LAT,
      max: MAX_LAT
    }))) {
    return next(new APIError(new Error(), {
      statusCode: 400,
      message: 'wrong item lat'
    }));
  }
  if (req.body.lng && !(typeof req.body.lng === 'number'
    && validator.isFloat(req.body.lng.toString(), {
      min: MIN_LNG,
      max: MAX_LNG
    }))) {
    return next(new APIError(new Error(), {
      statusCode: 400,
      message: 'wrong item lng'
    }));
  }
  if (req.body.address && !(typeof req.body.address === 'string')) {
    return next(new APIError(new Error(), {
      statusCode: 400,
      message: 'wrong item address'
    }));
  }

  if (req.body.createdDate && !(typeof req.body.createdDate === 'string'
    && validator.isDate(req.body.createdDate))) {
    return next(new APIError(new Error(), {
      statusCode: 400,
      message: 'wrong item createdDate'
    }));
  }
  if (req.body.modifiedDate && !(typeof req.body.modifiedDate === 'string'
    && validator.isDate(req.body.modifiedDate))) {
    return next(new APIError(new Error(), {
      statusCode: 400,
      message: 'wrong item modifiedDate'
    }));
  }
  if (req.body.category && !(typeof req.body.category === 'string'
    && CATEGORIES.indexOf(req.body.category) !== -1)) {
    return next(new APIError(new Error(), {
      statusCode: 400,
      message: 'wrong item category'
    }));
  }
  return next();
};