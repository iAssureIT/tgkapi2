const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth');
const InterestedPropsController = require('../controllers/interestedProperties');

router.post('/', checkAuth,InterestedPropsController.create_interestedProps); 

router.get('/list/:user_id',checkAuth,InterestedPropsController.list_myInterestedProps);

router.get('/:interestedPropsId', checkAuth,InterestedPropsController.detail_interestedProps);

router.delete('/:buyer_id/:property_id',checkAuth,InterestedPropsController.delete_interestedProps);

router.get('/meeting_list/:interestedId',checkAuth,InterestedPropsController.get_meeting_list);

// router.delete('/',InterestedPropsController.deleteall_interestedProps);

//Code By Anagha




module.exports = router;