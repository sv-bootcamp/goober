import express from 'express';
import controller from './controllers';

const router = express.Router();

/**
 * @api {get} /users/:id Get information of a user
 * @apiName get information of a user
 * @apiGroup User
 *
 * @apiParam {String} ID of target user
 *
 * @apiSuccess {Object} json
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        key: 'user-unique-key',
 *        name: 'test-user',
 *        email: 'test@email.com',
 *        imagePath: 'url-of-image'
 *     }
 *
 * @apiError (Error 500) Internal Server Error.
 *
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 InternalError
 *     {
 *       error: "database error"
 *     }
 */
router.get('/:id', controller.get);
