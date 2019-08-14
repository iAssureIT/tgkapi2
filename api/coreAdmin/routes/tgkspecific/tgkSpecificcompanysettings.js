const express 	= require("express");
const router 	= express.Router();

const TgkSpecificCompanysettingsController = require('../../controllers/tgkspecific/tgkSepcificcompanysettings');

router.post('/', TgkSpecificCompanysettingsController.create_companysettings);

router.get('/list',TgkSpecificCompanysettingsController.list_companysettings);

// router.post('/searchValue',TgkSpecificCompanysettingsController.search_companysettinginfo_office);

router.get('/:companysettingsID', TgkSpecificCompanysettingsController.detail_companysettings);

router.post('/companysettinglocation', TgkSpecificCompanysettingsController.detail_companysettings_locations);

router.patch('/', TgkSpecificCompanysettingsController.update_companysettings);

router.patch('/:info/:action', TgkSpecificCompanysettingsController.update_companysettings);

router.patch('/information', TgkSpecificCompanysettingsController.update_companysettinginfo);

router.delete('/:companysettingsID',TgkSpecificCompanysettingsController.delete_companysettings);


router.get('/email/:companyId', TgkSpecificCompanysettingsController.adminEmail_companysettings);


module.exports = router;