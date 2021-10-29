const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/place.controller');
const { authorize, SYSADMIN, ADMIN, USER } = require('../../middlewares/auth');
const {
  listPlace,
  createPlace,
  updatePlace,
  deletePlace,
} = require('../../validations/place.validation');

const router = express.Router();

/**
 * Load deviceType when API with deviceTypeId route parameter is hit
 */
router.param('placeId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/device-type List deviceType
   * @apiDescription Get a list of deviceTypes
   * @apiVersion 1.0.0
   * @apiName ListDeviceType
   * @apiGroup Device Type
   * @apiPermission SYSADMIN
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Users per page
   * @apiParam  {String}             [name]       User's name
   *
   * @apiSuccess {Object[]} deviceTypes List of deviceTypes.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only authorize role can access the data
   */
  .get(authorize([SYSADMIN, ADMIN]), validate(listPlace), controller.list)
  /**
   * @api {post} v1/device-type Create deviceType
   * @apiDescription Create a new deviceType
   * @apiVersion 1.0.0
   * @apiName CreateDeviceType
   * @apiGroup Device Type
   * @apiPermission SYSADMIN
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String{..128}}      name    device Type's name
   * @apiParam  {String{..128}}      pubTopic    device Type's pubTopic
   * @apiParam  {String{..128}}      rpcTopic    device Type's rpcTopic
   * @apiParam  {Number}      uniqueId    device Type's uniqueId
   * @apiParam  {String}      queuePrefix    device Type's queuePrefix
   * @apiParam  {String{10..255}}      [description]    device Type's description
   *
   * @apiSuccess (Created 201) {String}  id         device Type's id
   * @apiSuccess (Created 201) {String}  name       device Type's name
   * @apiSuccess (Created 201) {Number}  uniqueId      device Type's uniqueId
   * @apiSuccess (Created 201) {String}  pubTopic       device Type's pubTopic
   * @apiSuccess (Created 201) {String}  rpcTopic       device Type's rpcTopic
   * @apiSuccess (Created 201) {String}  queuePrefix       device Type's queuePrefix
   * @apiSuccess (Created 201) {String}  description       device Type's description
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden     Only authorize role can access the data
   */
  .post(authorize([SYSADMIN, ADMIN]), validate(createPlace), controller.create);

router
  .route('/:placeId')
  /**
   * @api {get} v1/device-type/:id Get deviceType
   * @apiDescription Get user information
   * @apiVersion 1.0.0
   * @apiName GetDeviceType
   * @apiGroup Device Type
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (Created 201) {String}  id         device Type's id
   * @apiSuccess (Created 201) {String}  name       device Type's name
   * @apiSuccess (Created 201) {Number}  uniqueId      device Type's uniqueId
   * @apiSuccess (Created 201) {String}  pubTopic       device Type's pubTopic
   * @apiSuccess (Created 201) {String}  rpcTopic       device Type's rpcTopic
   * @apiSuccess (Created 201) {String}  queuePrefix       device Type's queuePrefix
   * @apiSuccess (Created 201) {String}  description       device Type's description
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only authorize role can access the data
   * @apiError (Not Found 404)    NotFound     DeviceType does not exist
   */
  .get(authorize([SYSADMIN, ADMIN]), validate(deletePlace), controller.get)
  /**
   * @api {patch} v1/device-type/:id Update deviceType
   * @apiDescription Update some fields of a user document
   * @apiVersion 1.0.0
   * @apiName UpdateDeviceType
   * @apiGroup Device Type
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             email     User's email
   * @apiParam  {String{6..128}}     password  User's password
   * @apiParam  {String{..128}}      [name]    User's name
   * @apiParam  {String=user,admin}  [role]    User's role
   * (You must be an admin to change the user's role)
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  name       User's name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)     Forbidden     Only authorize role can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(authorize([SYSADMIN, ADMIN]), validate(updatePlace), controller.update)
  /**
   * @api {patch} v1/device-type/:id Delete deviceType
   * @apiDescription Delete a user
   * @apiVersion 1.0.0
   * @apiName DeleteDeviceType
   * @apiGroup Device Type
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)     Forbidden     Only authorize role can access the data
   * @apiError (Not Found 404)    NotFound      User does not exist
   */
  .delete(
    authorize([SYSADMIN, ADMIN]),
    validate(deletePlace),
    controller.remove,
  );

router
  .route('/organization/:orgId')
  .get(authorize([ADMIN, USER, SYSADMIN]), controller.listByOrg);

module.exports = router;
