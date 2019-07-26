const express = require('express');
const router = express.Router();


// api-routes.js
// Set default API response

router.get('/', function (req, res) {
    res.status(200).json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});


const masterNotificationsController = require('../controllers/masternotifications');

router.post('/', masterNotificationsController.create_template);

router.delete('/:notificationmasterID', masterNotificationsController.delete_template);

router.get('/list', masterNotificationsController.get_list);

router.get('/:notificationmasterID', masterNotificationsController.detail_fetch);

router.put('/:notificationmasterID', masterNotificationsController.update_notifications);



module.exports = router;