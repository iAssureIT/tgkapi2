const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth');
const PropertiesController = require('../controllers/properties');

router.post('/', checkAuth,PropertiesController.create_Properties);

router.get('/list',checkAuth,PropertiesController.list_Properties);

router.get('/list/admin/:status',checkAuth,PropertiesController.list_Properties_status);

router.get('/list/salesagent/:salesAgentID',checkAuth,PropertiesController.list_Properties_salesAgent);

router.post('/list/salesagent/type/:salesAgentID/:status',PropertiesController.list_Properties_salesAgent_type);

router.post('/post/list',PropertiesController.postList); 

router.post('/admin/post/list',checkAuth,PropertiesController.adminpostList); 

router.post('/post/transactionDetails',checkAuth,PropertiesController.list_InterestedProperties_FieldAgent_OuterStatus);

router.post('/listofproperty/:propertyType/:transactionType',checkAuth,PropertiesController.property_list);

router.get('/mypropertylist/:uid',checkAuth,PropertiesController.my_property_list);

router.get('/:propertyID', checkAuth,PropertiesController.detail_Properties);

router.get('/propertydetails/:propertyID/:buyer_id', checkAuth,PropertiesController.properties_details_for_web);

router.post('/one/property', checkAuth,PropertiesController.single_property);

// router.patch('/:info/:action', PropertiesController.update_Properties);
router.patch('/patch/properties', checkAuth,PropertiesController.update_firstpage);


router.patch('/patch/propertyDetails', checkAuth,PropertiesController.update_PropertyDetails);

router.patch('/patch/updateListing', checkAuth,PropertiesController.update_listing);

router.patch('/patch/updateStatus', checkAuth,PropertiesController.update_status);


router.patch('/patch/financials', checkAuth,PropertiesController.update_financials);

router.patch('/patch/amenities', checkAuth,PropertiesController.update_amenities);

// router.patch('/patch/video', PropertiesController.update_video);

router.patch('/patch/availabilityPlan', checkAuth,PropertiesController.update_availabilityPlan);

router.patch('/patch/gallaryImages', checkAuth,PropertiesController.update_gallaryImages);

router.patch('/patch/gallaryVideo', checkAuth,PropertiesController.update_gallaryVideo);

router.delete('/:propertyID',checkAuth,PropertiesController.delete_Properties);

router.delete('/',PropertiesController.deleteall_Properties);

// router.get('/get/:status',PropertiesController.prop_get_by_status);

// router.patch('/patch/updatestatus',PropertiesController.update_status)
router.get('/:propertyID', checkAuth,PropertiesController.detail_Properties);

//////////////

router.post('/post/findindexper', checkAuth,PropertiesController.find_PropertyIndexPer);




//Location wise properties

router.get('/get/locationWiseListCount', PropertiesController.locationWiseListCount);




///////////////////Field Agent--------------------

router.post('/post/allocateTofieldAgent/:propertyID', checkAuth,PropertiesController.allocateTofieldAgent);

///////////////////list_Properties_societies_subareas--------------------

router.post('/post/locationProperties',PropertiesController.list_Properties_societies_subareas);


module.exports = router;