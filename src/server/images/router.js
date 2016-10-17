import express from 'express';
import controller from './controllers';

const router = express.Router();

/**
 * @api {get} /images?imageid=image-unique-id Get an images
 * @apiName get an image
 * @apiGroup Image
 *
 * @apiParam {String} imageid ID of target image
 *
 * @apiSuccess {String} imageUrl image access url
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "imageUrl": "an-images-url"
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
 * @api {get} /images?itemid=item-unique-id Get all images of an item
 * @apiName get all image of an item
 * @apiGroup Image
 *
 * @apiParam {String} itemid ID of target item
 *
 * @apiSuccess {Array} imageUrls array of image access url
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "imageUrls": [
 *          "an-images-url",
 *          "an-images-url",
 *          "an-images-url",
 *          "an-images-url",
 *          "an-images-url",
 *          "an-images-url"
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
