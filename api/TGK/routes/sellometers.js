const express 	= require("express");
const router 	= express.Router();

const sellometersController = require('../controllers/sellometers');

router.post('/', sellometersController.create_sellometers);

router.get('/list', sellometersController.list_sellometers);

router.get('/:sellometersID', sellometersController.fetch_sellometers);

router.put('/:sellometersID', sellometersController.update_sell_O_meteor);

router.delete('/:sellometersID',sellometersController.delete_sellometers);


module.exports = router;