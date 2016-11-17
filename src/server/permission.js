import assert from 'assert';

export const PERMISSION = {
  RW: 'rw',
  R: 'r-',
  W: '-w',
  None: '--'
};

export const requiredPermission = (permission) => {
  return (req, res, next) => {
    assert(req.headers.permission, 'No permission in request header');

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
