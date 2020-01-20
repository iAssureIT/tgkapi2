const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth');
const MessagesController = require('../controllers/messages');

router.post('/post/coversation',MessagesController.coversation);

router.get('/get/coversation/:prop_id',MessagesController.get_coversation);

module.exports = router;