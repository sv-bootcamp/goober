import express from 'express';
import ItemContollers from './controllers';

const router = express.Router();


/**
 * @api {get} /items Request All item information
 * @apiName getAllItem
 * @apiGroup Item
 *
 * @apiParam {None} None
 *
 * @apiSuccess {Object} User User detail info.
 * @apiSuccess {Object} User Users unique Id.
 * @apiSuccess {String} name Users name.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       some format....
 *     }
 *
 * @apiError ItemNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "ItemNotFound"
 *     }
 */
router.get('/', ItemContollers.getAll);

router.post('/', (req, res, next) => {
  next();
});

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
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: ['item1', 'item2', ..]
 *     }
 */
router.delete('/', ItemContollers.removeAll);

router.get('/:id', (req, res, next) => {
  next();
});

router.put('/:id', (req, res, next) => {
  next();
});

/**
 * @api {delete} /items/:id Remove an item
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
