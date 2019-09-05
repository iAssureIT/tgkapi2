const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth');
const MastersellometersController = require('../controllers/mastersellometers');

router.post('/', checkAuth,MastersellometersController.create_mastersellometers);

router.get('/list', checkAuth,MastersellometersController.list_mastersellometers);

router.get('/:mastersellometersID', checkAuth,MastersellometersController.fetch_mastersellometers);

router.put('/:mastersellometersID', checkAuth,MastersellometersController.update_master_sell_O_meteor);

router.delete('/:mastersellometersID',MastersellometersController.delete_mastersellometers);


module.exports = router;