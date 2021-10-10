const express = require('express');
const controller = require('../../controllers/event.controller');
const { authorize, ADMIN, SYSADMIN, USER } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/device-profile List deviceProfile
   * @apiDescription Get a list of deviceProfile
   * @apiVersion 1.0.0
   * @apiName ListDeviceProfile
   * @apiGroup Device Profile
   * @apiPermission ADMIN, SYSADMIN, OWNER
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  DeviceProfile per page
   * @apiParam  {String}             [name]       DeviceProfile's name
   *
   * @apiSuccess {Object[]} deviceProfile List of deviceProfiles.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only authorized user can access the data
   */
  .get(authorize([ADMIN, SYSADMIN, USER]), controller.list);

router
  .route('/quick')
  /**
   * @api {get} v1/device-profile List deviceProfile
   * @apiDescription Get a list of deviceProfile
   * @apiVersion 1.0.0
   * @apiName ListDeviceProfile
   * @apiGroup Device Profile
   * @apiPermission ADMIN, SYSADMIN, OWNER
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  DeviceProfile per page
   * @apiParam  {String}             [name]       DeviceProfile's name
   *
   * @apiSuccess {Object[]} deviceProfile List of deviceProfiles.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only authorized user can access the data
   */
  .get(authorize([ADMIN, SYSADMIN, USER]), controller.allInOut);

module.exports = router;
