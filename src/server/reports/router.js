import express from 'express';
import Controllers from './controllers';
import {requiredPermission, PERMISSION} from '../permission';

const router = express.Router();

/**
 * @api {add} /reports Add a report from item or image.
 * @apiName reportAnItem
 * @apiGroup Report
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *      }
 *
 * @apiSuccess {String} message success
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "success"
 *     }
 *
 * @apiError (Error 500) error internal error
 * @apiErrorExample {json} Internal-Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message ..."
 *     }
 */
router.post('/', requiredPermission(PERMISSION.W), Controllers.post);

export default router;
