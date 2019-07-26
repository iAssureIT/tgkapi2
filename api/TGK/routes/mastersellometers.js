const express 	= require("express");
const router 	= express.Router();

const MastersellometersController = require('../controllers/mastersellometers');

router.post('/', MastersellometersController.create_mastersellometers);

router.get('/list', MastersellometersController.list_mastersellometers);

router.get('/:mastersellometersID', MastersellometersController.fetch_mastersellometers);

router.put('/:mastersellometersID', MastersellometersController.update_master_sell_O_meteor);

router.delete('/:mastersellometersID',MastersellometersController.delete_mastersellometers);


module.exports = router;