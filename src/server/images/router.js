import express from 'express';
import controller from './controllers';
import {requiredPermission, PERMISSION} from '../permission';

const router = express.Router();

/**
 * @api {get} /images/:id Get an image
 * @apiName get an image
 * @apiGroup Image
 *
 * @apiHeader {String} authorization access token.
 * @apiHeaderExample {json} Request-Example:
 * { "authorization": "bearer access_token" }
 *
 * @apiParam {String} id Unique ID of target image
 *
 * @apiSuccess {String} image object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        key: 'image-8523306706662-c8a94c49-0c3c-414a-bec0-74fc369a105e',
 *        userKey: 'user-1234uuid',
 *        caption: 'thisissmaplecode.',
 *        createdDate: '2016-10-17T08:34:53.338Z',
 *        url: 'url-of-image-8523306706662-c8a94c49-0c3c-414a-bec0-74fc369a105e'

 *     }
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
 * @api {get} /images?item=item-unique-id Get all images of an item
 * @apiName get all image of an item
 * @apiGroup Image
 *
 * @apiHeader {String} authorization access token.
 * @apiHeaderExample {json} Request-Example:
 * { "authorization": "bearer access_token" }
 *
 * @apiParam {String} item ID of target item
 *
 * @apiSuccess {Array} image json array
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "values": [
 *          {
 *            key: 'image-8523306706662-c8a94c49-0c3c-414a-bec0-74fc369a105e',
 *            userKey: 'user-1234uuid',
 *            caption: 'thisissmaplecode.',
 *            createdDate: '2016-10-17T08:34:53.338Z',
 *            url: 'url-of-image-8523306706662-c8a94c49-0c3c-414a-bec0-74fc369a105e'
 *          },
 *          ......
 *        ]
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
router.get('/', requiredPermission(PERMISSION.R), controller.getAll);

/**
 * @api {add} /images Add an image
 * @apiName addAnImage
 * @apiGroup Image
 *
 * @apiHeader {String} authorization access token.
 * @apiHeaderExample {json} Request-Example:
 * { "authorization": "bearer access_token" }
 *
 * @apiParam {String} itemKey Item key that include a image
 * @apiParam {String} caption caption
 * @apiParam {String} image base64 encoding image
 * @apiParamExample {json} Request-Example:
 *      {
 *          "itemKey"         : "textTitle",
 *          "caption"         : 'Je loves soju',
 *          "image"           : 'iVBORw0KGgo...'
 *      }
 *
 * @apiSuccess {String} message success
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "success",
 *       "data"   : {
 *        itemkey: "item-852319345000000-290dkdrt-ifgr-ifjf-wiwj-jodijsfijfds",
 *        imageKey: "image-8523193492003-2d5f3460-d53a-42d3-a138-ae201070f27c"
 *       }
 *     }
 *
 * @apiError (Error 500) error The id of the error occured while putting an Item in DB
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message ..."
 *     }
 */
router.post('/', requiredPermission(PERMISSION.W), controller.post);

/**
 * @api {Delete} /images/image-unique-id Remove an image
 * @apiName RemoveAnImage
 * @apiGroup Image
 *
 * @apiHeader {String} authorization access token.
 * @apiHeaderExample {json} Request-Example:
 * { "authorization": "bearer access_token" }
 *
 *
 * @apiSuccess {String} message success
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "success",
 *       "data"   : "image-8523193492003-2d5f3460-d53a-42d3-a138-ae201070f27c"
 *     }
 *
 * @apiError (Error 500) error The id of the error occured while putting an Item in DB
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message ..."
 *     }
 */
router.delete('/:id', requiredPermission(PERMISSION.W), controller.remove);

export default router;
