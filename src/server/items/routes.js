import express from 'express';
import ItemControllers from './controllers';

const router = express.Router();

/**
 * @api {get} /items?lat=30.565398&lng=126.9907941&zoom=21 Get All items
 * @apiName getAllItem
 * @apiGroup Item
 *
 * @apiParam {None} None
 *
 * @apiSuccess {Object} items items list.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "items":[
 *          {
 *            "id"          : 'item1',
 *            "title"       : 'textTitle',
 *            "lat"         : 30.565398,
 *            "lng"         : 126.9907941,
 *            "address"     : 'testAddress',
 *            "createdDate" : '2016-10-04T04:00:00.578Z',
 *            "modifiedDate": '2016-10-04T04:00:00.578Z',
 *            "category"    : 'warning', 'event', 'facility'
 *            "startTime"   : '2016-10-04T04:00:00.578Z',
 *            "endTime"     : '2016-10-10T04:00:00.578Z'
 *          },
 *          {
 *            "id"          : 'item2',
 *            "title"       : 'textTitle2',
 *            "lat"         : 32.565398,
 *            "lng"         : 153.9907941,
 *            "address"     : 'testAddress2',
 *            "createdDate" : '2016-10-04T04:00:00.578Z',
 *            "modifiedDate": '2016-10-04T04:00:00.578Z',
 *            "category"    : 'warning', 'event', 'facility'
 *            "startTime"   : '2016-10-04T04:00:00.578Z',
 *            "endTime"     : '2016-10-10T04:00:00.578Z'
 *          }
 *        ]
 *     }
 * @apiError (Error 500) DatabaseError Internal error occured in the database.
 *
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 InternalError
 *     {
 *       error: "database error"
 *     }
 */
router.get('/', ItemControllers.getAll);

/**
 * @api {add} /items Add an item
 * @apiName addAnItem
 * @apiGroup Item
 *
 * @apiParam {String} title title
 * @apiParam {Number} lat lat(e.g. 37.565398)
 * @apiParam {Number} lng lng(e.g. 126.9907941)
 * @apiParam {String} address address
 * @apiParam {String} category category
 * @apiParam {String} startTime startTime
 * @apiParam {String} endTime endTime
 * @apiParam {String} image base64 encoding image
 * @apiParamExample {json} Request-Example:
 *      {
 *          "title"       : "textTitle",
 *          "lat"         : 30.565398,
 *          "lng"         : 126.9907941,
 *          "address"     : "testAddress",
 *          "category"    : 'warning', 'event', 'facility'
 *          "startTime"   : '2016-10-04T04:00:00.578Z',
 *          "endTime"     : '2016-10-10T04:00:00.578Z'
 *          "image"       : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA5IAAAIYCAYAAAAfLdMYAAAL'
 *      }
 *
 * @apiSuccess {String} message success
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "success",
 *       "data"   : "item-wv6mcsrb-5795ef07-d25c-42b2-8797-c242acaa5a9a"
 *     }
 *
 * @apiError (Error 500) error The id of the error occured while putting an Item in DB
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message ..."
 *     }
 */
router.post('/', ItemControllers.addItem);

router.put('/', (req, res, next) => {
  next();
});

/**
 * @api {delete} /items Remove all item
 * @apiName removeAllItem
 * @apiGroup Item
 *
 * @apiParam {None} None
 *
 * @apiSuccess {String} message success
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       message: "success"
 *     }
 *
 * @apiError (Error 500) Internal server error
 * @apiErrorExample {json} Internal Server Error Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message..."
 *     }
 */
router.delete('/', ItemControllers.removeAll);

/**
 * @api {get} /items/:id Get an item by id
 * @apiName getItem
 * @apiGroup Item
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
 *        "endTime"     : '2016-10-10T04:00:00.578Z'
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
router.get('/:id', ItemControllers.getById);

/**
 * @api {modify} /items/:id Modify an item
 * @apiName modifyAnItem
 * @apiGroup Item
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
 *          "title"       : "texttitle",
 *          "lat"         : 30.565398,
 *          "lng"         : 126.9907941,
 *          "address"     : "testAddress",
 *          "category"    : 'warning', 'event', 'facility'
 *          "startTime"   : '2016-10-04T04:00:00.578Z',
 *          "endTime"     : '2016-10-10T04:00:00.578Z'
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
router.put('/:id', ItemControllers.modify);

/**
 * @api {delete} /items/:id Remove an item
 * @apiName removeAnItem
 * @apiGroup Item
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
router.delete('/:id', ItemControllers.remove);

export default router;
