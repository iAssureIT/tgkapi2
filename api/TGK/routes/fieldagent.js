const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth');
const PropertiesController = require('../controllers/properties');
const FAController = require('../controllers/fieldagent');

router.get('/list/type/:fieldAgentID/:status',checkAuth,PropertiesController.list_Properties_fieldAgent_type);




module.exports = router;