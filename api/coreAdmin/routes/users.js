const express 	= require("express");

const router 	= express.Router();

const checkAuth     = require('../middlerware/check-auth');

const UserController = require('../controllers/users');

// router.post('/', UserController.user_signup); 

router.post('/', UserController.user_signupadmin); 

router.post('/login',UserController.user_login); 

router.post('/userslist',UserController.users_fetch); 

router.get('/list', UserController.users_list); 

router.patch('/:userID',UserController.update_user); 

// router.get('/verify_mobile/',UserController.users_verify_mobile); 

router.get('/userslist', UserController.users_directlist); 

router.put('/resetpwd/:userID',UserController.update_user_resetpassword);  

router.get('/:userID',UserController.user_details); 

router.post('/searchValue',UserController.user_search); 

router.post('/officesearchValue',UserController.search_user_office); 

router.post('/statusaction',UserController.account_status); 

router.post('/roleadd',UserController.account_role_add); 

router.post('/roledelete',UserController.account_role_remove); 

router.delete('/:userID',UserController.delete_user);

router.delete('/',UserController.deleteall_user);  

router.patch('/:rolestatus',UserController.user_change_role);  

module.exports = router;