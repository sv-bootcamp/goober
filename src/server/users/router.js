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
 * @api {add} /users/signup signup user
 * @apiName signupUser
 * @apiGroup User
 *
 * @apiParam {String} userType user type; anonymous, facebook
 * @apiParam {String} [facebookToken] facebook token
 * @apiParamExample {json} Request-Example:
 *      {
 *          "userType"      : "facebook",
 *          "facebookToken" :	"facebookToken"
 *      }
 *
 * @apiSuccess {String} accessToken access token
 * @apiSuccess {String} refreshToken refresh token
 * @apiSuccess {String} [userKey] user key
 * @apiSuccess {String} [userSecret] user secret
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "accessToken"  : "accessToken",
 *       "refreshToken" : "refreshToken",
 *       "userKey"      : "userKey",
 *       "userSecret"   : "userSecret"
 *     }
 *
 * @apiError (Error 500) error Database Internal error
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message ..."
 *     }
 */
router.post('/signup', controller.signup);

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

/**
 * @api {add} /users/createdpost Add a created post of a user
 * @apiName addACreatedpost
 * @apiGroup User
 *
 * @apiParam {String} entity entity(item or image)
 * @apiParam {String} entityKey entityKey
 * @apiParam {String} userKey userKey
 * @apiParamExample {json} Request-Example:
 *      {
 *          "entity"      : "image",
 *          "entityKey"   : "image-8523569761934-dd3860f5-b82e-473b-1234-ead0fts43200",
 *          "userKey"     : "user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000",
 *      }
 *
 * @apiSuccess {String} message success
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "success",
 *       "data"   : "createdPost-0-user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000-~~"
 *     }
 *
 * @apiError (Error 500) error The id of the error occured while putting an Item in DB
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message ..."
 *     }
 */
router.post('/createdpost', controller.addCreatedPost);


/*
 *
 * @api {add} /users/savedpost Add a saved post of a user
 * @apiName addASavedpost
 * @apiGroup User
 *
 * @apiParam {String} entityKey entityKey
 * @apiParam {String} userKey userKey
 * @apiParamExample {json} Request-Example:
 *      {
 *          "entity"      : "item",
 *          "entityKey"   : "item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000",
 *          "userKey"     : "user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000",
 *      }
 *
 * @apiSuccess {String} message success
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "success",
 *       "data"   : "savedPost-0-user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000-~~"
 *     }
 *
 * @apiError (Error 500) error The id of the error occured while putting an Item in DB
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message ..."
 *     }
 */
router.post('/savedpost', controller.addSavedPost);

export default router;
