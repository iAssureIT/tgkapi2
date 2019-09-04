const express 	= require("express");
const router 	= express.Router();
const checkAuth     = require('../middlerware/check-auth');
const projectsettingController = require('../controllers/projectSettings');

router.post('/', checkAuth,projectsettingController.create_projectSettings);

router.get('/get/one/:type', checkAuth,projectsettingController.fetch_projectsettings);

router.get('/list', checkAuth,projectsettingController.list_projectsettings);



// 
module.exports = router;