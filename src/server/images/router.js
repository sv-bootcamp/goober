import express from 'express';
import controller from './controllers';

const router = express.Router();

/**
 * @api {get} /images?image=image-unique-id Get an images
 * @apiName get an image
 * @apiGroup Image
 *
 * @apiParam {String} image ID of target image
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


/**
 * @api {get} /images?item=item-unique-id Get all images of an item
 * @apiName get all image of an item
 * @apiGroup Image
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
router.get('/', controller.get);

/**
 * @api {add} /image Add an image
 * @apiName addAnImage
 * @apiGroup Image
 *
 * @apiParam {String} itemKey Item key that include a image
 * @apiParam {String} userKey User Key that post a image
 * @apiParam {String} caption caption
 * @apiParam {String} image base64 encoding image
 * @apiParamExample {json} Request-Example:
 *      {
 *          "itemKey"         : "textTitle",
 *          "userKey"         : 'user-8523574664000-b82e-473b-1234-ead0f54gvr00',
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
router.post('/', controller.post);

export default router;
