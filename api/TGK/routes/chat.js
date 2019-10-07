const ChatController = require('../controllers/chat');
const express 	     = require("express");
const router 	     = express.Router();

  // // View messages to and from authenticated user
  // router.get('/', ChatController.getConversations);

  // Retrieve single conversation
  router.get('/:conversationId', ChatController.getConversation);

  // Send reply in conversation
  router.post('/:conversationId', ChatController.sendReply);

  // Start new conversation
  router.post('/new/:recipient', ChatController.newConversation);

  module.exports = router;