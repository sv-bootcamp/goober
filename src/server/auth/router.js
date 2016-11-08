import express from 'express';
import controller from './controllers';

const router = express.Router();

/**
 * @api  /auth/refresh refresh token
 * @apiName refreshToken
 * @apiGroup Auth
 *
 * @apiParam {String} refreshToken
 * @apiParamExample {json} Request-Example:
 *      {
 *          "refreshToken": "refreshToken"
 *      }
 *
 * @apiSuccess {String} accessToken new access token
 * @apiSuccess {String} refreshToken new refresh token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "accessToken"  : "new access token",
 *       "refreshToken" : "new refresh token"
 *     }
 *
 * @apiError (Error 400) error the refresh token is invalid.
 * @apiErrorExample {json} Invalid-Refresh-Token-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       error: "error message ..."
 *     }
 *
 */
router.post('/auth/refresh', controller.refreshToken);

/**
 * @api  /auth/grant authentication grant
 * @apiName authGrant
 * @apiGroup Auth
 *
 * @apiParam {String} grantType anonymous, facebook
 * @apiParam {String} [userSecret] user secret
 * @apiParam {String} [facebookToken] facebook token
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "grantType": "anonymous",
 *          "userSecret": "userSecret",
 *          "facebookToken": "facebookSecret"
 *      }
 *
 * @apiSuccess {String} accessToken new access token
 * @apiSuccess {String} refreshToken new refresh token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "accessToken"  : "new access token",
 *       "refreshToken" : "new refresh token"
 *     }
 *
 * @apiError (Error 400) error not granted.
 * @apiErrorExample {json} Not-Granted-Error-Response
 *     HTTP/1.1 400 Bad Request
 *     {
 *       error: "error message ..."
 *     }
 *
 * @apiError (Error 500) error database error
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message ..."
 *     }
 */
router.post('/auth/grant', controller.grant);
