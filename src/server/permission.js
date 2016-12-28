import {APIError} from './ErrorHandler';
import config from 'config';

export const ADMIN_SECRET = process.env.ADMIN_SECRET || config.adminSecret;

export const PERMISSION = {
  RW: 'rw',
  R: 'r-',
  W: '-w',
  None: '--'
};

// @TODO add a user aspect to permission policy like UNIX.
export const requiredPermission = (permission) => {
  return (req, res, next) => {
    if (!req.headers.permission) {
      next(new APIError(new Error('No permission in request header'), 403));
      return;
    }

    let requireR = permission[0] ? permission[0] : null;
    let requireW = permission[1] ? permission[1] : null;
    const permittedR = req.headers.permission[0] ? req.headers.permission[0] : null;
    const permittedW = req.headers.permission[1] ? req.headers.permission[1] : null;
    requireR = requireR !== '-' ? requireR : null;
    requireW = requireW !== '-' ? requireW : null;

    if ((requireR && requireR !== permittedR) ||
      (requireW && requireW !== permittedW)) {
      res.sendStatus(403);
      return;
    }
    next();
  };
};

export const requiredAdmin = () => {
  return (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization !== ADMIN_SECRET) {
      next(new APIError(new Error('Unauthorized request'), 403));
      return;
    }
    next();
  };
};
