const express 	= require("express");
const router 	= express.Router();

const RoleController = require('../controllers/roles');

router.post('/', RoleController.create_role);

router.get('/list', RoleController.list_role);

router.get('/:role', RoleController.detail_role);

router.put('/',RoleController.update_role);

router.delete('/:roleID',RoleController.delete_role);


module.exports = router;