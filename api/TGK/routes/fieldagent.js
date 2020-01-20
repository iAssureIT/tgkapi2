const express 	= require("express");
const router 	= express.Router();
const checkAuth = require('../../coreAdmin/middlerware/check-auth');
const PropertiesController = require('../controllers/properties');
const FAController = require('../controllers/fieldagent');

router.get('/get/type/allocatedToFieldAgent/:fieldAgentID/:status',checkAuth,PropertiesController.list_Properties_fieldAgent_type);
router.get('/get/transactionDetails/:user_id/:status',checkAuth,FAController.list_InterestedProperties_FieldAgent_OuterStatus);
router.get('/get/interestedproperties_totalcount/:fieldAgentID',FAController.count_properties);
router.patch('/patch/setUpMeeting',checkAuth,FAController.patch_setUpMeeting);
router.patch('/patch/updateMeeting',checkAuth,FAController.patch_updateMeeting);
router.patch('/patch/transactionUpdate',checkAuth,FAController.patch_transaction_status_Update);
router.get('/get/famanagerDashboardQueryClient/:fieldAgentID',FAController.fa_manager_dashboard_query_client);
router.get('/get/famanagerDashboardQuerySA/:fieldAgentID',FAController.fa_manager_dashboard_query_sa);
router.get('/get/famanagerdashboardtracking/:fieldAgentID',FAController.fa_manager_tracking_dashboard);

module.exports = router;