const express 	= require("express");
const router 	= express.Router();

const projectsettingController = require('../controllers/projectSetting');

router.get('/get/one/:type', projectsettingController.fetch_projectsettings);

router.post('/', projectsettingController.create_projectSettings);


module.exports = router;