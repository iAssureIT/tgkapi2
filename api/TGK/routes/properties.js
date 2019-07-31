const express 	= require("express");
const router 	= express.Router();

const PropertiesController = require('../controllers/properties');

router.post('/', PropertiesController.create_Properties);

router.get('/list',PropertiesController.list_Properties);

router.post('/listofproperty/:propertyType/:transactionType',PropertiesController.property_list);

router.get('/mypropertylist/:uid',PropertiesController.my_property_list);

router.get('/:propertyID', PropertiesController.detail_Properties);

// router.patch('/:info/:action', PropertiesController.update_Properties);

router.patch('/patch/propertyLocation', PropertiesController.update_PropertyLocation);

router.patch('/patch/propertyDetails', PropertiesController.update_PropertyDetails);

router.patch('/patch/amenities', PropertiesController.update_amenities);

router.patch('/patch/financials', PropertiesController.update_financials);

router.patch('/patch/images/video', PropertiesController.update_photosandvideos);

// router.patch('/patch/video', PropertiesController.update_video);

router.patch('/patch/availabilityPlan', PropertiesController.update_availabilityPlan);

router.delete('/:propertyID',PropertiesController.delete_Properties);

router.delete('/',PropertiesController.deleteall_Properties);

router.get('/get/:status',PropertiesController.prop_get_by_status);

// router.patch('/patch/updatestatus',PropertiesController.update_status);

module.exports = router;