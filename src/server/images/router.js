import express from 'express';
import controller from './controllers';

const router = express.Router();

/**
<<<<<<< 7dbd01e25568a70efc5cec06094fdb855b47a285
 * @api {get} /images?image=image-unique-id Get an images
 * @apiName get an image
 * @apiGroup Image
 *
 * @apiParam {String} image ID of target image
 *
 * @apiSuccess {String} image object
=======
 * @api {get} /images?imageid=image-unique-id Get an images
 * @apiName get an image
 * @apiGroup Image
 *
 * @apiParam {String} imageid ID of target image
 *
 * @apiSuccess {String} imageUrl image access url
>>>>>>> Add image module
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
<<<<<<< 7dbd01e25568a70efc5cec06094fdb855b47a285
 *        key: 'image-8523306706662-c8a94c49-0c3c-414a-bec0-74fc369a105e',
 *        userKey: 'user-1234uuid',
 *        caption: 'thisissmaplecode.',
 *        createdDate: '2016-10-17T08:34:53.338Z',
 *        url: 'url-of-image-8523306706662-c8a94c49-0c3c-414a-bec0-74fc369a105e'
=======
 *        "imageUrl": "an-images-url"
>>>>>>> Add image module
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


export default router;
