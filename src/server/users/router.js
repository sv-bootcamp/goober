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
 *        imageUrl: 'url-of-image'
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

/**
 * @api {add} /users Add a user
 * @apiName addAUser
 * @apiGroup User
 *
 * @apiParam {String} name user name
 * @apiParam {String} email email
 * @apiParam {String} password password
 * @apiParam {String} image base64 encoding image
 * @apiParamExample {json} Request-Example:
 *      {
 *          "title"       : "textTitle",
 *          "name"		    :	"Hewon Jeong",
 *    	    "email"		    :	"hewonjeong@goober.com",
 *   	      "password"	  :	"ghldnjs!@#123",
 *    	    "image"		    :	"iVBORw0KGgoAAAANSUhEUgAAAB4AAAAOCAMAAAAPOFwLAAAACXBIWXMAA"
 *      }
 *
 * @apiSuccess {String} message success
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "success",
 *       "data"   : "user-8522530204522-ce285a9d-2d62-454d-b6f2-3ea591031b83"
 *     }
 *
 * @apiError (Error 500) error The id of the error occured while putting a user in DB
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message ..."
 *     }
 */
router.post('/', controller.post);

export default router;
