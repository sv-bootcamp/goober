import express from 'express';

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
router.get('/', (req, res, next) => {
  next();
});

router.post('/', (req, res, next) => {
  next();
});

router.put('/', (req, res, next) => {
  next();
});

router.delete('/', (req, res, next) => {
  next();
});

router.get('/:id', (req, res, next) => {
  next();
});

router.put('/:id', (req, res, next) => {
  next();
});

router.delete('/:id', (req, res, next) => {
  next();
});

export default router;
