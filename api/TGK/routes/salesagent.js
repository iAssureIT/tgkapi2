const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth');
const SAController = require('../controllers/salesagent');

router.patch('/patch/approvedlist',SAController.update_approvedlist);

router.post('/post/displaylist',SAController.property_sa_displaylist);


module.exports = router;