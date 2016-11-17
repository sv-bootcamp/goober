import express from 'express';
import controller from './controllers';
import {requiredPermission, PERMISSION} from '../permission';

const router = express.Router();
/**
 * @api {get} /users/:id Get information of a user
 * @apiName get information of a user
 * @apiGroup User
 *
 * @apiParam {String} id of target user
 *
 * @apiSuccess {Object} json
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        key: 'user-unique-key',
 *        name: 'test-user',
 *        email: 'test@email.com',
 *        profileImgUrl: 'url-of-image'
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
router.get('/:id', requiredPermission(PERMISSION.R), controller.getById);

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
 * @apiSuccess {String} userKey unique user key
 * @apiSuccess {String} [userSecret] only anonymous user get user secret
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
 *          "title"         : "textTitle",
 *          "name"		    : "Hewon Jeong",
 *    	    "email"		    : "hewonjeong@goober.com",
 *   	    "password"	    : "ghldnjs!@#123",
 *    	    "image"		    : "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAOCAMAAAAPOFwLAAAACXBIWXMAA"
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
router.post('/', requiredPermission(PERMISSION.W), controller.post);

/**
 *
=======
>>>>>>>  update apidoc
 * @api {add} /users/savedposts Add a saved post of a user
 * @apiName addASavedpost
 * @apiGroup User
 *
 * @apiParam {String} userKey userKey
 * @apiParam {String} itemKey itemKey
 * @apiParamExample {json} Request-Example:
 *      {
 *          "entity"      : "item",
 *          "userKey"     : "user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000",
 *          "itemKey"     : "item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000",
 *      }
 *
 * @apiSuccess {String} message success
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "success",
 *       "data"   : "savedPost-user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000-~~"
 *     }
 *
 * @apiError (Error 500) error The id of the error occured while putting an Item in DB
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message ..."
 *     }
 */
router.post('/savedposts', requiredPermission(PERMISSION.W), controller.addSavedPost);

/**
 * @api {get} /users/savedposts/:id Get saved(favorite) posts of user
 * @apiName get saved(favorite) posts of user
 * @apiGroup User
 *
 * @apiParam {String} ID of target user
 *
 * @apiSuccess {Object} json
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *          title       : 'Lion popup store',
 *          lat         : 37.756787937,
 *          lng         : -122.4233365122,
 *          address     : '310 Dolores St, San Francisco, CA 94110, USA',
 *          createdDate : '2016-10-13T01:11:46.851Z',
 *          modifiedDate: '2016-10-13T01:11:46.851Z',
 *          category    : 'event',
 *          startTime   : '2016-10-13T01:11:46.851Z',
 *          endTime     : '2016-11-08T07:28:21.676Z',
 *          state       : 'alive',
 *          key         : 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
 *          userKey     : 'user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid',
 *          imageUrls   :
 *            [ 'url-of-thumbnail-image-8523569761934-dd3860f5-b82e-473b-1234-ead0f190b000',
 *              'url-of-thumbnail-image-8523569761934-dd3860f5-b82e-473b-1234-ead0f54gvr00',
 *              'url-of-thumbnail-image-8523569761934-dd3860f5-b82e-473b-1234-ead0fts0b000',
 *              'url-of-thumbnail-image-8523569761934-dd3860f5-b82e-473b-1234-ead0fts43200'
 *            ]
 *        }
 *      ]
 * @apiError (Error 500) Internal Server Error.
 *
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 InternalError
 *     {
 *       error: "database error"
 *     }
*/
router.get('/savedposts/:id', requiredPermission(PERMISSION.R), controller.getSavedPosts);

/**
 * @api {get} /users/createdposts/:id Get created(activity) posts of user
 * @apiName get created(activity) posts of user
 * @apiGroup User
 *
 * @apiParam {String} ID of target user
 *
 * @apiSuccess {Object} json
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *          title       : 'Lion popup store',
 *          lat         : 37.756787937,
 *          lng         : -122.4233365122,
 *          address     : '310 Dolores St, San Francisco, CA 94110, USA',
 *          createdDate : '2016-10-13T01:11:46.851Z',
 *          modifiedDate: '2016-10-13T01:11:46.851Z',
 *          category    : 'event',
 *          state       : 'alive',
 *          startTime   : '2016-10-13T01:11:46.851Z',
 *          endTime     : '2016-11-08T07:28:21.676Z',
 *          state       : 'alive',
 *          key         : 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
 *          userKey     : 'user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid',
 *          entity      : 'image',
 *          imageUrl    : 'url-of-image-8523569763000-dd3860f5-b82e-473b-1234-ead0fzr0b000'
 *        }
 *      ]
 * @apiError (Error 500) Internal Server Error.
 *
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 InternalError
 *     {
 *       error: "database error"
 *     }
*/
router.get('/createdposts/:id', requiredPermission(PERMISSION.R), controller.getCreatedPosts);

/**
 * @api {delete} /users/savedposts/ Delete savedpost
 * @apiName deleteSavedPost
 * @apiGroup User
 *
 * @apiParam {String} itemKey item key
 * @apiParam {String} userKey user key
 * @apiParamExample {json} Request-Example:
 *      {
 *          "itemKey"       : 'item-8523193492003-2d5f3460-d53a-42d3-a138-ae201070f27c',
 *          "userKey"       : 'user-8523574664000-b82eb82e-473b-1234-1234-ead0f54gvr00'
 *      }
 *
 * @apiSuccess {String} message message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "success",
 *     }
 * @apiError (Error 500) DatabaseError Internal error occured in the database.
 *
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 InternalError
 *     {
 *       error: "database error"
 *     }
 */
router.delete('/createdposts', requiredPermission(PERMISSION.W), controller.deleteSavedPost);

export default router;
