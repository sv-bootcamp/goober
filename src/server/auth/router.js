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
router.post('/refresh', controller.refreshToken);

/**
 * @api  /auth/grant authentication grant
 * @apiName authGrant
 * @apiGroup Auth
 *
 * @apiParam {String} grantType anonymous, facebook
 * @apiParam {String} [userKey] user key; only for anonymous grant
 * @apiParam {String} [userSecret] user secret; only for anonymous grant
 * @apiParam {String} [facebookToken] facebook token; only for facebook grant
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "grantType"     : "anonymous",
 *          "userKey"       : "userKey"
 *          "userSecret"    : "userSecret",
 *          "facebookToken" : "facebookSecret"
 *      }
 *
 * @apiSuccess {String} accessToken new access token
 * @apiSuccess {String} refreshToken new refresh token
 * @apiSuccess {String} userKey unique user key
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "accessToken"  : "new access token",
 *       "refreshToken" : "new refresh token",
 *       "userKey"      : "unique user key"
 *     }
 *
 * @apiError (Error 400) error not granted.
 * @apiErrorExample {json} Not-Granted-Error-Response
 *     HTTP/1.1 400 Bad Request
 *     {
 *       error: "wrong facebook access token"
 *     }
 *
 * @apiError (Error 400) error not granted.
 * @apiErrorExample {json} Not-Granted-Error-Response
 *     HTTP/1.1 400 Bad Request
 *     {
 *       error: "wrong secret"
 *     }
 *
 * @apiError (Error 500) error database error
 * @apiErrorExample {json} Database-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "error message ..."
 *     }
 */
router.post('/grant', controller.grant);


/**
 * @api  /auth/validate validate token
 * @apiName authValidate
 * @apiGroup Auth
 *
 * @apiParam {String} accessToken access token to validate
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "accessToken": "accessTokenToValidate"
 *      }
 *
 * @apiSuccess {String} message result message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message" : "Access Token is valid"
 *     }
 *
 * @apiError (Error 400) error invalid token.
 * @apiErrorExample {json} Invalid-Token-Error-Response
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Access Token is invalid"
 *     }
 *
 */
router.post('/validate', controller.validate);

export default router;
