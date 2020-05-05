const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth');
const MessagesController = require('../controllers/messages');

router.post('/post/coversation',MessagesController.coversation);

router.get('/get/getConversationforSA/:prop_id',MessagesController.get_coversation_for_sa_query);

router.get('/get/getConversation/:prop_id',MessagesController.get_coversation);

router.get('/get/getCoversationforClient/:trans_id',MessagesController.get_coversation_for_client_query);

router.patch('/delete/message',MessagesController.delete_messages);

module.exports = router;