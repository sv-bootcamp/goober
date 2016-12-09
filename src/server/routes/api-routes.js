import express from 'express';
import items from '../items/routes';
import images from '../images/router';
import users from '../users/router';
import reports from '../reports/router';
import auth from '../auth/router';
import admin from '../admin/router';
import AuthToken from '../auth-token';
import validator from '../items/validator';
import {requiredAdmin} from '../permission';
import {handle404} from '../ErrorHandler';
import logger from 'winston';

const router = express.Router();

router.use('/admin', requiredAdmin(), admin, handle404);
router.use(AuthToken.authenticate);
router.use('/items', validator, items);
router.use('/images', images);
router.use('/users', users);
router.use('/reports', reports);
router.use('/auth', auth);
router.use(handle404);

/* eslint-disable no-unused-vars */
router.use((errHandler, req, res, next) => {
  errHandler.statusCode = errHandler.statusCode ? errHandler.statusCode : 500;
  res.status(errHandler.statusCode).send({
    error: errHandler.message
  });
  logger.error(`${errHandler.statusCode} ${errHandler.message}`);
});
/* eslint-enable */

/*
 we need to fix error message
 there is two case
 1. prod
 2. dev
 */

export default router;
