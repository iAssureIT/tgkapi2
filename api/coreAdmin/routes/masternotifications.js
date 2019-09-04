const express = require('express');
const router = express.Router();
const checkAuth     = require('../middlerware/check-auth');

// api-routes.js
// Set default API response

router.get('/', checkAuth,function (req, res) {
    res.status(200).json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});


const masterNotificationsController = require('../controllers/masternotifications');

router.post('/', checkAuth,masterNotificationsController.create_template);

router.delete('/:notificationmasterID', checkAuth,masterNotificationsController.delete_template);

router.get('/list', checkAuth,masterNotificationsController.get_list);

router.get('/:notificationmasterID', checkAuth,masterNotificationsController.detail_fetch);

router.put('/:notificationmasterID', checkAuth,masterNotificationsController.update_notifications);

router.post('/post/sendNotification', checkAuth,masterNotificationsController.send_notifications);



module.exports = router;