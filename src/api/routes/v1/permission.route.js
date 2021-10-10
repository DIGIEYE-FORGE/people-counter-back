const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/deviceProfile.controller');
const { authorize, ADMIN, SYSADMIN, OWNER } = require('../../middlewares/auth');
const {
  listDeviceProfile,
  createDeviceProfile,
  deleteDeviceProfile,
  replaceDeviceProfile,
  updateDeviceProfile,
} = require('../../validations/deviceProfile.validation');

const router = express.Router();

/**
 * Load deviceProfile when API with deviceProfileId route parameter is hit
 */
router.param('deviceProfileId', controller.load);

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
  .get(
    authorize([ADMIN, SYSADMIN, OWNER]),
    validate(listDeviceProfile),
    controller.list,
  )
  /**
   * @api {post} v1/device-profile Create deviceProfile
   * @apiDescription Create a new deviceProfile
   * @apiVersion 1.0.0
   * @apiName CreateDeviceProfile
   * @apiGroup Device Profile
   * @apiPermission ADMIN, SYSADMIN, OWNER
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String{..128}}      name    DeviceProfile's name
   * @apiParam  {String{..1024}}  decoder    DeviceProfile's role
   * @apiParam  {String{..256}}  note    DeviceProfile's role
   *
   * @apiSuccess (Created 201) {String}  id         DeviceProfile's id
   * @apiSuccess (Created 201) {String}  name       DeviceProfile's name
   * @apiSuccess (Created 201) {String}  note       DeviceProfile's note
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden     Only authorized user can access the data
   */
  .post(
    authorize([ADMIN, SYSADMIN, OWNER]),
    validate(createDeviceProfile),
    controller.create,
  );

router
  .route('/:deviceProfileId')
  /**
   * @api {get} v1/device-profile/:id Get DeviceProfile
   * @apiDescription Get deviceProfile information
   * @apiVersion 1.0.0
   * @apiName GetDeviceProfile
   * @apiGroup Device Profile
   * @apiPermission ADMIN, SYSADMIN, OWNER
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (Created 201) {String}  id         DeviceProfile's id
   * @apiSuccess (Created 201) {String}  name       DeviceProfile's name
   * @apiSuccess (Created 201) {String}  decoder       DeviceProfile's decoder
   * @apiSuccess (Created 201) {String}  note       DeviceProfile's note
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only authorized user can access the data
   * @apiError (Not Found 404)    NotFound     DeviceProfile does not exist
   */
  .get(
    authorize([ADMIN, SYSADMIN, OWNER]),
    validate(deleteDeviceProfile),
    controller.get,
  )
  /**
   * @api {put} v1/device-profile/:id Replace DeviceProfile
   * @apiDescription Replace the whole deviceProfile document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceDeviceProfile
   * @apiGroup Device Profile
   * @apiPermission ADMIN, SYSADMIN, OWNER
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String{..128}}      name    DeviceProfile's name
   * @apiParam  {String{..1024}}  decoder    DeviceProfile's role
   * @apiParam  {String{..256}}  [note]    DeviceProfile's role
   * (You must be an admin to change the user's role)
   *
   * @apiSuccess (Created 201) {String}  id         DeviceProfile's id
   * @apiSuccess (Created 201) {String}  name       DeviceProfile's name
   * @apiSuccess (Created 201) {String}  note       DeviceProfile's note
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only authorized user can modify the data
   * @apiError (Not Found 404)    NotFound     DeviceProfile does not exist
   */
  .put(
    authorize([ADMIN, SYSADMIN, OWNER]),
    validate(replaceDeviceProfile),
    controller.replace,
  )
  /**
   * @api {patch} v1/device-profile/:id Update DeviceProfile
   * @apiDescription Update some fields of a deviceProfile document
   * @apiVersion 1.0.0
   * @apiName UpdateDeviceProfile
   * @apiGroup Device Profile
   * @apiPermission ADMIN, SYSADMIN, OWNER
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String{..128}}      [name]    DeviceProfile's name
   * @apiParam  {String{..1024}}  [decoder]    DeviceProfile's role
   * @apiParam  {String{..256}}  [note]    DeviceProfile's role
   *
   * @apiSuccess (Created 201) {String}  id         DeviceProfile's id
   * @apiSuccess (Created 201) {String}  name       DeviceProfile's name
   * @apiSuccess (Created 201) {String}  note       DeviceProfile's note
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only authorized user can modify the data
   * @apiError (Not Found 404)    NotFound     DeviceProfile does not exist
   */
  .patch(
    authorize([ADMIN, SYSADMIN, OWNER]),
    validate(updateDeviceProfile),
    controller.update,
  )
  /**
   * @api {patch} v1/device-profile/:id Delete DeviceProfile
   * @apiDescription Delete a deviceProfile
   * @apiVersion 1.0.0
   * @apiName DeleteDeviceProfile
   * @apiGroup Device Profile
   * @apiPermission SYSADMIN, OWNER
   *
   * @apiHeader {String} Authorization User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only authorized user can delete the data
   * @apiError (Not Found 404)    NotFound      DeviceProfile does not exist
   */
  .delete(
    authorize([SYSADMIN, OWNER, ADMIN]),
    validate(deleteDeviceProfile),
    controller.remove,
  );

module.exports = router;
