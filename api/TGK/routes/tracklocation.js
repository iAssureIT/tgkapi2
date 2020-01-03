const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth');
const tracklocationController = require('../controllers/tracklocation');

router.post('/post',tracklocationController.create_location);

module.exports = router;