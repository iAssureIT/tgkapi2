const express 	= require("express");
const router 	= express.Router();
const checkAuth     = require('../middlerware/check-auth');
const RoleController = require('../controllers/roles');

router.post('/', checkAuth,RoleController.create_role);

router.get('/list', checkAuth,RoleController.list_role);

router.get('/:role', checkAuth,RoleController.detail_role);

router.put('/',checkAuth,RoleController.update_role);

router.delete('/:roleID',RoleController.delete_role);


module.exports = router;