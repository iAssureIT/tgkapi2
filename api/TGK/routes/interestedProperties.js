const express 	= require("express");
const router 	= express.Router();

const InterestedPropsController = require('../controllers/interestedProperties');

router.post('/', InterestedPropsController.create_interestedProps);

router.get('/list/:user_id',InterestedPropsController.list_myInterestedProps);

router.get('/:interestedPropsId', InterestedPropsController.detail_interestedProps);

router.delete('/:buyer_id/:property_id',InterestedPropsController.delete_interestedProps);

// router.delete('/',InterestedPropsController.deleteall_interestedProps);


module.exports = router;