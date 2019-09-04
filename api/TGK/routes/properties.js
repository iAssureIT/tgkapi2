const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth');
const PropertiesController = require('../controllers/properties');

router.post('/', checkAuth,PropertiesController.create_Properties);

router.get('/list',checkAuth,PropertiesController.list_Properties);

router.post('/post/list',checkAuth,PropertiesController.postList); 

router.post('/admin/post/list',checkAuth,PropertiesController.adminpostList); 

router.post('/listofproperty/:propertyType/:transactionType',checkAuth,PropertiesController.property_list);

router.get('/mypropertylist/:uid',checkAuth,PropertiesController.my_property_list);

router.get('/:propertyID', checkAuth,PropertiesController.detail_Properties);

// router.patch('/:info/:action', PropertiesController.update_Properties);
router.patch('/patch/properties', checkAuth,PropertiesController.update_firstpage);

router.patch('/patch/propertyLocation', checkAuth,PropertiesController.update_PropertyLocation);

router.patch('/patch/propertyDetails', checkAuth,PropertiesController.update_PropertyDetails);

router.patch('/patch/updateListing', checkAuth,PropertiesController.update_listing);

router.patch('/patch/amenities', checkAuth,PropertiesController.update_amenities);

router.patch('/patch/financials', checkAuth,PropertiesController.update_financials);

router.patch('/patch/gallery', checkAuth,PropertiesController.update_photosandvideos);

// router.patch('/patch/video', PropertiesController.update_video);

router.patch('/patch/availabilityPlan', checkAuth,PropertiesController.update_availabilityPlan);

router.delete('/:propertyID',checkAuth,PropertiesController.delete_Properties);

router.delete('/',checkAuth,PropertiesController.deleteall_Properties);


// router.get('/get/:status',PropertiesController.prop_get_by_status);

// router.patch('/patch/updatestatus',PropertiesController.update_status)
router.get('/:propertyID', checkAuth,PropertiesController.detail_Properties);

router.patch('/patch/sa/approvedlist', checkAuth,PropertiesController.update_approvedlist);

router.post('/post/sa/displaylist', checkAuth,PropertiesController.property_displaylist);

//////////////

router.post('/post/findindexper', checkAuth,PropertiesController.find_PropertyIndexPer);

//Location wise properties

router.get('/get/locationWiseListCount', checkAuth,PropertiesController.locationWiseListCount);


module.exports = router;