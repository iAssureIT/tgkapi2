const express 	= require("express");
const router 	= express.Router();
const checkAuth     = require('../middlerware/check-auth');
const CompanySettingController = require('../controllers/companysettings');

router.post('/', checkAuth,CompanySettingController.create_companysettings);

router.get('/list',checkAuth,CompanySettingController.list_companysettings);

router.get('/:companysettingsID', checkAuth,CompanySettingController.detail_companysettings);

router.patch('/', checkAuth,CompanySettingController.update_companysettings);

router.patch('/:info/:action',checkAuth, CompanySettingController.update_companysettings);

router.delete('/:companysettingsID',checkAuth,CompanySettingController.delete_companysettings);

router.get('/email/:companysettingsID', checkAuth,CompanySettingController.adminEmail_companysettings);


module.exports = router;