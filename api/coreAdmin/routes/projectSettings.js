const express 	= require("express");
const router 	= express.Router();

const projectsettingController = require('../controllers/projectSettings');

router.post('/', projectsettingController.create_projectSettings);

router.get('/get/one/:type', projectsettingController.fetch_projectsettings);

router.get('/list', projectsettingController.list_projectsettings);



// 
module.exports = router;