	const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth');
const MasteramenitiesController = require('../controllers/masteramenities');

router.post('/', checkAuth,MasteramenitiesController.create_masteramenities);

router.get('/list',checkAuth,MasteramenitiesController.list_masteramenities);

router.get('/:amenitiesID', checkAuth,MasteramenitiesController.fetch_masteramenities);

router.put('/:amenitiesID',checkAuth,MasteramenitiesController.update_masteramenities);

router.delete('/:amenitiesID',checkAuth,MasteramenitiesController.delete_masteramenities);





module.exports = router;