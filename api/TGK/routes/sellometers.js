const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth');
const sellometersController = require('../controllers/sellometers');

router.post('/', checkAuth,sellometersController.create_sellometers);

router.get('/list',checkAuth, sellometersController.list_sellometers);

router.get('/:sellometersID',checkAuth, sellometersController.fetch_sellometers);

router.put('/:sellometersID',checkAuth, sellometersController.update_sell_O_meteor);

router.delete('/:sellometersID',checkAuth,sellometersController.delete_sellometers);


module.exports = router;