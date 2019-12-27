const express 	= require("express");
const router 	= express.Router();


const checkAuth     = require('../middlerware/check-auth');



//========  OTP Based Signup & Login  ===========


const OTPController = require('../controllers/otp');
//Old API
router.post('/verify_mobile', OTPController.users_verify_mobile); 
// router.post('/verifyuser', OTPController.verify_user); 

//New API
router.post('/verify_mobile_new', OTPController.users_verify_mobile_new); 
router.post('/verify_user_new', OTPController.verify_user_new); 
// router.post('/otpverified', OTPController.login_otp_verifications);


router.patch('/signup', OTPController.user_signup); 

router.get('/get_user_details', OTPController.get_user_details); 



// router.post('/otpverification', OTPController.signup_generate_otp);


module.exports = router;