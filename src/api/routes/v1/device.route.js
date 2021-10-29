const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/device.controller');
const { authorize, ADMIN, USER, SYSADMIN } = require('../../middlewares/auth');

const {
  deleteDevice,
  listDevices,
  createDevice,
} = require('../../validations/device.validation');

const router = express.Router();

router.param('deviceId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/devices List Devices
   * @apiDescription Get a list of devices
   * @apiVersion 1.0.0
   * @apiName ListDevices
   * @apiGroup Device
   * @apiPermission OWNER | ADMIN | USER | OPERATOR
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]       List page
   * @apiParam  {Number{1-100}}      [perPage=1]    Devices per page
   * @apiParam  {String}             [username]     Device's username
   * @apiParam  {ObjectId}           [organization] Device's organization
   * @apiParam  {ObjectId}           [deviceType]   Device's deviceType
   * @apiParam  {ObjectId}           [deviceGroup]  Device's deviceGroup
   *
   * @apiSuccess {Object[]} devices   List of devices.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated user can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(
    authorize([ADMIN, USER, SYSADMIN]),
    validate(listDevices),
    controller.list,
  )
  /**
   * @api {post} v1/devices Create Device
   * @apiDescription Create a new device
   * @apiVersion 1.0.0
   * @apiName CreateDevice
   * @apiGroup Device
   * @apiPermission OWNER | ADMIN
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}      username      Device's username
   * @apiParam  {ObjectId}    organization  Device's organization
   * @apiParam  {ObjectId}    deviceType    Device's type
   * @apiParam  {ObjectId}    [deviceGroup] Device's group
   *
   * @apiSuccess (Created 201) {String}  id         Device's id
   * @apiSuccess (Created 201) {String}  username       Device's name
   * @apiSuccess (Created 201) {String}  serial      Device's serial
   * @apiSuccess (Created 201) {deviceGroupObject}  group       Device's group
   * @apiSuccess (Created 201) {deviceTypeObject}  type       Device's type
   * @apiSuccess (Created 201) {deviceProfileObject}  type       Device's profile
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated user can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins and owners can create the data
   */
  .post(
    authorize([SYSADMIN, ADMIN]),
    validate(createDevice),
    controller.create,
  );

router
  .route('/:deviceId')
  /**
   * @api {get} v1/devices/:deviceId Get Device
   * @apiDescription Get device information
   * @apiVersion 1.0.0
   * @apiName GetDevice
   * @apiGroup Device
   * @apiPermission ADMIN | USER | OPERATOR | OWNER
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (Created 201) {String}  id         Device's id
   * @apiSuccess (Created 201) {String}  username       Device's name
   * @apiSuccess (Created 201) {String}  serial      Device's serial
   * @apiSuccess (Created 201) {deviceGroupObject}  group       Device's group
   * @apiSuccess (Created 201) {deviceTypeObject}  type       Device's type
   * @apiSuccess (Created 201) {deviceProfileObject}  type       Device's profile
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated user can access the data
   * @apiError (Forbidden 403)    Forbidden    Only admins and owner can access the data
   * @apiError (Not Found 404)    NotFound     Device does not exist
   */
  .get(
    authorize([ADMIN, USER, SYSADMIN]),
    validate(deleteDevice),
    controller.get,
  )
  /**
   * @api {patch} v1/devices/:id Delete Device
   * @apiDescription Delete a device
   * @apiVersion 1.0.0
   * @apiName DeleteDevice
   * @apiGroup Device
   * @apiPermission device
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only admins or owner can delete the data
   * @apiError (Not Found 404)    NotFound      Device does not exist
   */
  .delete(
    authorize([SYSADMIN, ADMIN]),
    validate(deleteDevice),
    controller.remove,
  );

router.route('/orgs').post(controller.getByOrg);

module.exports = router;
