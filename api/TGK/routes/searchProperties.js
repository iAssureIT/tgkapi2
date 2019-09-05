const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth');
const searchPropertiesController = require('../controllers/search');

router.post('/properties',searchPropertiesController.searchProperties);


module.exports = router;