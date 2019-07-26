const express 	= require("express");
const router 	= express.Router();

const MasteramenitiesController = require('../controllers/masteramenities');

router.post('/', MasteramenitiesController.create_masteramenities);

router.get('/list',MasteramenitiesController.list_masteramenities);

router.get('/:amenitiesID', MasteramenitiesController.fetch_masteramenities);

router.put('/:amenitiesID',MasteramenitiesController.update_masteramenities);

router.delete('/:amenitiesID',MasteramenitiesController.delete_masteramenities);





module.exports = router;