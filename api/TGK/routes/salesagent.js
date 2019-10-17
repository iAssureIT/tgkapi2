const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth');
const SAController = require('../controllers/salesagent');

router.patch('/patch/approvedlist',SAController.update_approvedlist);

router.post('/post/displaylist',SAController.property_sa_displaylist);

router.get('/get/gettotaldisplaylist',SAController.property_sa_totaldisplaylist);




module.exports = router;