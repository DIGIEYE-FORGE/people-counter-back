const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/area.controller');
const { authorize, ADMIN, SYSADMIN, USER } = require('../../middlewares/auth');
const {
  listArea,
  updateArea,
  deleteArea,
  createArea,
} = require('../../validations/area.validation');

const router = express.Router();

router.param('areaId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/areas List Device Groups
   * @apiDescription Get a list of areas
   * @apiVersion 1.0.0
   * @apiName List Device Groups
   * @apiGroup Device Groups
   * @apiPermission  ADMIN | SYSADMIN
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]       List page
   * @apiParam  {Number{1-100}}      [perPage=1]    Device Groups  per page
   * @apiParam  {String}             [name]     Device Groups's name
   * @apiParam  {ObjectId}           [organization] Device Group's organization
   *
   * @apiSuccess {Object[]} deviceGroups  List of device groups.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated user can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([ADMIN, SYSADMIN]), validate(listArea), controller.list)
  /**
   * @api {post} v1/users Create device Group
   * @apiDescription Create a new device Group
   * @apiVersion 1.0.0
   * @apiName CreateArea
   * @apiGroup Device Groups
   * @apiPermission  ADMIN | USER | OPERATOR
   *
   * @apiHeader {String} Authorization   Device Group's access token
   *
   * @apiParam  {String}             name     Device Group's email
   * @apiParam  {String{6..256}}     description  Device Group's description
   * @apiParam  {ObjectId}      defaultDeviceProfile    Device Group's default device profile
   * @apiParam  {String=user,admin}  [role]    User's role
   *
   * @apiSuccess (Created 201) {String}  id         User's id
   * @apiSuccess (Created 201) {String}  name       User's name
   * @apiSuccess (Created 201) {String}  email      User's email
   * @apiSuccess (Created 201) {String}  role       User's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize([ADMIN, SYSADMIN]), validate(createArea), controller.create);

router
  .route('/:areaId')
  /**
   * @api {get} v1/users/:id Get User
   * @apiDescription Get user information
   * @apiVersion 1.0.0
   * @apiName GetUser
   * @apiGroup Device Groups
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  name       User's name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(authorize([ADMIN, USER, SYSADMIN]), controller.get)
  /**
   * @api {patch} v1/users/:id Update User
   * @apiDescription Update some fields of a user document
   * @apiVersion 1.0.0
   * @apiName UpdateUser
   * @apiGroup Device Groups
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
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(authorize([ADMIN, SYSADMIN]), validate(updateArea), controller.update)
  /**
   * @api {patch} v1/users/:id Delete User
   * @apiDescription Delete a user
   * @apiVersion 1.0.0
   * @apiName DeleteUser
   * @apiGroup Device Groups
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      User does not exist
   */
  .delete(
    authorize([ADMIN, SYSADMIN]),
    validate(deleteArea),
    controller.remove,
  );

router
  .route('/organization/:orgId')
  .get(authorize([ADMIN, USER, SYSADMIN]), controller.listByOrg);

// TODO append device to group and get list of devices by group
module.exports = router;
