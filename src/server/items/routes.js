import express from 'express';
import ItemContollers from './controllers';

const router = express.Router();


/**
 * @api {get} /items Get All items
 * @apiName getAllItem
 * @apiGroup Item
 *
 * @apiParam {None} None
 *
 * @apiSuccess {Object[]} items items list.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        items : [
 *          {
 *              id : 1,
 *              description: 'textDescription',
 *              lat: 30.565398,
 *              lng: 126.9907941,
 *              address: 'testAddress',
 *              createdDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
 *              modifiedDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
 *              category: 'default'
 *          }
 *        ]
 *     }
 * 
 * @apiError (Error 500) DatabaseError Internal error occured in the database.
 *
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 InternalError
 *     {
 *       error: "database error"
 *     }
 */
router.get('/', ItemContollers.getAll);

router.post('/', (req, res, next) => {
  next();
});

router.put('/', (req, res, next) => {
  next();
});

router.delete('/', (req, res, next) => {
  next();
});

/**
 * @api {get} /items/:id Get an item by id
 * @apiName getItem
 * @apiGroup Item
 *
 * @apiParam {Number} id Unique id of the item.
 *
 * @apiSuccess {Number} id Unique id of the item.
 * @apiSuccess {String} description description of the item.
 * @apiSuccess {Number} lat latitude of the item.
 * @apiSuccess {Number} lng longitude of the item.
 * @apiSuccess {String} address address of the item.
 * @apiSuccess {String} createdDate created date of the item.
 * @apiSuccess {String} updatedDate updated date of the item.
 * @apiSuccess {String} category category of the item.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        id : 1,
 *        description: 'textDescription',
 *        lat: 30.565398,
 *        lng: 126.9907941,
 *        address: 'testAddress',
 *        createdDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
 *        modifiedDate: 'Wed Mar 25 2015 09:00:00 GMT+0900 (KST)',
 *        category: 'default'
 *     }
 *
 * @apiError (Error 400) ItemNotFound The id of the Item was not found.
 *
 * @apiErrorExample {json} Bad-Request-Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       error: "Item was not found."
 *     }
 * 
 * @apiError (Error 500) DatabaseError Internal error occured in the database.
 *
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 InternalError
 *     {
 *       error: "database error"
 *     }
 */
router.get('/:id', (req, res, next) => {
  next();
});

router.put('/:id', (req, res, next) => {
  next();
});

/**
 * @api {deleye} /items/:id Remove an item
 * @apiName removeAnItem
 * @apiGroup Item
 *
 * @apiParam {Number} id Item's own id
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
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       message: "error message..."
 *     }
 */
router.delete('/:id', ItemContollers.remove);

export default router;
