const express 	= require("express");
const router 	= express.Router();


const checkAuth     = require('../middlerware/check-auth');



//========  OTP Based Signup & Login  ===========


const OTPController = require('../controllers/otp');

router.post('/verify_mobile', OTPController.users_verify_mobile); 

// router.post('/otpverified', OTPController.login_otp_verifications);


router.patch('/signup', OTPController.user_signup); 

// router.post('/otpverification', OTPController.signup_generate_otp);


module.exports = router;