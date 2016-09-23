import express from 'express';
import items from '../items/routes';
import validator from '../items/validator';

const router = express.Router();

router.use('/items', validator, items);

router.use('/*', (req, res) => {
  if (res.statusCode === 200 || res.statusCode === 304) {
    return;
  }
  res.status(404).send('API Request > 404 - Page Not Found');
});

router.use((errHandler, req, res, next) => {
  res.status(errHandler.statusCode).send({
    error: errHandler.message
  });
  next(errHandler.error);
});

/*
 we need to fix error message
 there is two case
 1. prod
 2. dev
 */

export default router;
