import express from 'express';
import ItemControllers from './controllers';
import {requiredPermission, PERMISSION} from '../permission';

const router = express.Router();

/**
 * @api {get} /items?lat=37.768696&lng=-122.419495&zoom=14&isThumbnail=true Get All items
 * @apiName getAllItem
 * @apiGroup Item
 *
 * @apiHeader {String} authorization access token.
 * @apiHeaderExample {json} Request-Example:
 * { "authorization": "bearer access_token" }
 *
 * @apiParam {None} None
 *
 * @apiSuccess {Object} items items list.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "items": [
 *         {
 *            "title"       : "Union Square Public Toilet",
 *            "lat"         : 37.7632684,
 *            "lng"         : -122.4182374,
 *            "address"     : "2295 Harrison St, San Francisco, CA 94110, United States",
 *            "createdDate" : "2016-10-08T01:11:46.851Z",
 *            "modifiedDate": "2016-10-08T01:11:46.851Z",
 *            "category"    : "facility",
 *            "startTime"   : "2016-10-08T01:11:46.851Z",
 *            "endTime"     : "2016-10-20T01:11:46.851Z",
 *            "key": "item-8523910540000-b82e-473b-1234-ead0f190b005",
 *            "imageUrls"   : [
 *              "https://goober-item-image",
 *              "https://goober-item-image",
 *              "https://goober-item-image",
 *              "https://goober-item-image"
 *            ],
 *            "isSaved"     : true
 *          },
 *          {
 *            "title"       : "Cafe Free Wifi",
 *            "lat"         : 37.7652022,
 *            "lng"         : -122.4201257,
 *            "address"     : "2500 17th St, San Francisco, CA 94110, United State",
 *            "createdDate" : "2016-10-09T01:11:46.851Z",
 *            "modifiedDate": "2016-10-09T01:11:46.851Z",
 *            "category"    : "facility",
 *            "startTime"   : "2016-10-09T01:11:46.851Z",
 *            "endTime"     : "2016-10-19T01:11:46.851Z",
 *            "key"         : "item-8523910540001-b82e-473b-1234-ead0f190b004",
 *            "imageUrls"   : [
 *              "https://goober-item-image",
 *              "https://goober-item-image",
 *              "https://goober-item-image",
 *              "https://goober-item-image"
 *            ],
 *            "isSaved"     : false
 *          },
 *       ]
 *    }
 * @apiError (Error 500) DatabaseError Internal error occured in the database.
 *
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 InternalError
 *     {
 *       error: "database error"
 *     }
 */
router.get('/', requiredPermission(PERMISSION.R), ItemControllers.getAll);

/**
 * @api {add} /items Add an item
 * @apiName addAnItem
 * @apiGroup Item
 *
 * @apiHeader {String} authorization access token.
 * @apiHeaderExample {json} Request-Example:
 * { "authorization": "bearer access_token" }
 *
 * @apiParam {String} title title
 * @apiParam {Number} lat lat(e.g. 37.565398)
 * @apiParam {Number} lng lng(e.g. 126.9907941)
 * @apiParam {String} address address
 * @apiParam {String} category category
 * @apiParam {String} [startTime] startTime
 * @apiParam {String} [endTime] endTime
 * @apiParam {String} image base64 encoding image
 * @apiParam {String} caption caption of image
 * @apiParamExample {json} Request-Example:
 *      {
 *          "title"       : "textTitle",
 *          "lat"         : 30.565398,
 *          "lng"         : 126.9907941,
 *          "address"     : "testAddress",
 *          "category"    : "warning", "event", "acility",
 *          "startTime"   : "2016-10-04T04:00:00.578Z",
 *          "endTime"     : "2016-10-10T04:00:00.578Z",
 *          "image"       : "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAOCAMAAAAPOFwLAAAACXBIWXMAA",
 *          "caption"     : "Zihoon loves zzactae."
 *      }
 *
 * @apiSuccess {String} message success
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "success",
 *       "data"   : {
 *         "itemKey"  : "item-8523193492003-2d5f3460-d53a-42d3-a138-ae201070f27c"
 *         "imageKey" : "image-8523193492003-2d5f3460-d53a-42d3-a138-ae201070f27c"
 *       }
 *
 *     }
 *
 * @apiError (Error 500) error The id of the error occured while putting an Item in DB
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message ..."
 *     }
 */
router.post('/', requiredPermission(PERMISSION.W), ItemControllers.add);

/**
 * @api {get} /items/:id Get an item by id
 * @apiName getItem
 * @apiGroup Item
 *
 * @apiHeader {String} authorization access token.
 * @apiHeaderExample {json} Request-Example:
 * { "authorization": "bearer access_token" }
 *
 * @apiParam {String} id Unique id of the item.
 *
 * @apiSuccess {Number} id Unique id of the item.
 * @apiSuccess {String} title title of the item.
 * @apiSuccess {Number} lat latitude of the item.
 * @apiSuccess {Number} lng longitude of the item.
 * @apiSuccess {String} address address of the item.
 * @apiSuccess {String} category category of the item.
 * @apiSuccess {String} startTime startTime
 * @apiSuccess {String} endTime endTime
 * @apiSuccess {Array} imageUrls array of image urls
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "id"          : 'item1',
 *        "title"       : 'textTitle',
 *        "lat"         : 30.565398,
 *        "lng"         : 126.9907941,
 *        "address"     : 'testAddress',
 *        "createdDate" : '2016-10-04T04:00:00.578Z',
 *        "modifiedDate": '2016-10-04T04:00:00.578Z',
 *        "category"    : 'warning', 'event', 'facility'
 *        "startTime"   : '2016-10-04T04:00:00.578Z',
 *        "endTime"     : '2016-10-10T04:00:00.578Z',
 *        "imageUrls"   : ['image-url', 'image-url', ..]
 *     }
 *
 * @apiError (Error 400) ItemNotFound The id of the Item was not found.
 *
 * @apiErrorExample {json} Bad-Request-Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       error: "Item was not found."
 *     }
 * @apiError (Error 500) DatabaseError Internal error occured in the database.
 *
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 InternalError
 *     {
 *       error: "database error"
 *     }
 */
router.get('/:id', requiredPermission(PERMISSION.R), ItemControllers.getById);

/**
 * @api {modify} /items/:id Modify an item
 * @apiName modifyAnItem
 * @apiGroup Item
 *
 * @apiHeader {String} authorization access token.
 * @apiHeaderExample {json} Request-Example:
 * { "authorization": "bearer access_token" }
 *
 * @apiParam {String} title title
 * @apiParam {Number} lat lat(e.g. 37.565398)
 * @apiParam {Number} lng lng(e.g. 126.9907941)
 * @apiParam {String} address address
 * @apiParam {String} category category
 *
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "key"         : "item-unique-key"
 *          "title"       : "texttitle",
 *          "lat"         : 30.565398,
 *          "lng"         : 126.9907941,
 *          "address"     : "testAddress",
 *          "userKey"     : 'user-unique-key'
 *          "category"    : 'warning', 'event', 'facility'
 *          "createdDate" : '2016-10-04T04:00:00.578Z',
 *          "modifiedDate": '2016-10-10T04:00:00.578Z'
 *          "startTime"   : '2016-10-04T04:00:00.578Z',
 *          "endTime"     : '2016-10-10T04:00:00.578Z'
 *      }
 *
 *
 * @apiSuccess {String} message success
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       message: "success"
 *     }
 *
 * @apiError (Error 400) ItemNotFound The id of the Item was not found.
 * @apiError (Error 500) error The id of the error occured while putting an Item in DB
 * @apiErrorExample Bad Request Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       error: "error message..."
 *     }
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message..."
 *     }
 */
router.put('/:id', requiredPermission(PERMISSION.W), ItemControllers.modify);

/**
 * @api {delete} /items/:id Remove an item
 * @apiName removeAnItem
 * @apiGroup Item
 *
 * @apiHeader {String} authorization access token.
 * @apiHeaderExample {json} Request-Example:
 * { "authorization": "bearer access_token" }
 *
 * @apiParam {String} id Item's own id
 *
 * @apiSuccess {String} message success
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       message: "success"
 *     }
 *
 * @apiError (Error 400) ItemNotFound The id of the Item was not found.
 * @apiError (Error 500) Internal Server Error
 *
 * @apiErrorExample Bad Request Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       error: "error message..."
 *     }
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message..."
 *     }
 */
router.delete('/:id', requiredPermission(PERMISSION.W), ItemControllers.remove);

export default router;
