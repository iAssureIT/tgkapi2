const express 	= require("express");
const router 	= express.Router();

const searchPropertiesController = require('../controllers/search');

router.post('/properties', searchPropertiesController.searchProperties);


module.exports = router;