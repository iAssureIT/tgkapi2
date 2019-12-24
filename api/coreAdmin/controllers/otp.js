// const bcrypt		= require("bcrypt");
// const jwt			= require("jsonwebtoken");

const plivo = require('plivo');
const User 		= require('../models/users');
const mongoose	= require("mongoose");
const request   = require('request-promise');
const globalVariable = require('../../../nodemon.js');
const jwt           = require("jsonwebtoken");
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.user_signup = (req,res,next)=>{
    // console.log("Request = ",req.body);
        User.updateOne(
            { _id:req.body.userID},  
            {
                $set:{
                    "profile.fullName"      : req.body.fullName,
                    "profile.emailId"       : req.body.emailId,	
                    "profile.city"          : req.body.city,	
                    "profile.status"        : req.body.status,
                    "roles"                 : req.body.roles,
                    

                }
            }
        )
        .then(user =>{
            // console.log('user ',user);
            if(user.nModified == 1){
                return res.status(200).json({
                    "message" : 'USER-UPDATED',
                    "user_id" : user._id,
                });	
            }else{
                res.status(401).json("User Not Found");
            }		
        })
               
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
			
};

function createUser(mobileNumber,countryCode){
    return new Promise(function(resolve,reject){
        const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        createdAt       : new Date,                    
                        mobileNumber  : mobileNumber,
                        countryCode   : countryCode,                                  
                        profile     : {                            
                                    mobileNumber  : mobileNumber,
                                    countryCode   : countryCode,                              
                        },
                        roles   : ['Client'],
                        status  : "Active",
                    });
        user.save()
        .then((result)=> {
            resolve(result);
        })
        .catch(otpError=>{
            reject(otpError);        
        });

    })
};
function updateOTP(user_ID,otp){
    return new Promise(function(resolve,reject){
        User.updateOne(
                    { _id: user_ID},  
                    {
                        $set:{
                            "profile.otp" : otp,
                        }
                    })
                .exec()
                .then(data=>{
                    resolve(true);
                })
                .catch(err=>{
                    reject(err)
                })

    })
}

exports.users_verify_mobile = (req,res,next)=>{
    // console.log("body data ",req.body);
    User.findOne({'mobileNumber':req.body.mobileNumber, 'countryCode' : req.body.countryCode},{'profile.fullName':1})
        .exec()
        .then(user =>{
            var userData = user;
            // console.log('1. USER = ',user);
            getData();
            async function getData(){
                var msg = "MOBILE-NUMBER-EXISTS";
                if(!user){
                    var newUser = await createUser(req.body.mobileNumber,req.body.countryCode);
                    user = newUser;
                    msg = "NEW-USER-CREATED";
                }
                // const OTP = getRandomInt(1000,9999);
                const OTP = 1234;
                // const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
                // const sourceMobile = "+919923393733";
                // var text = OTP+" is your OTP for online verification to your LYVO Account. OTP is valid for 24 hours and can be only used once."; 
                // client.messages.create(
                //     src=sourceMobile,
                //     dst=req.body.countryCode+''+req.body.mobileNumber,
                //     text=text
                // ).then((result)=> {
                    // console.log("src = ",src," | DST = ", dst, " | result = ", result);
                    const token = jwt.sign({
                            mobile   : req.body.mobileNumber,
                            // userId   : mongoose.Types.ObjectId(user._id) ,
                            userId  : user._id ,
                        },globalVariable.JWT_KEY,
                        {
                            expiresIn: "365d"
                        }
                        );
                    // console.log("otp ",OTP);
                        User.updateOne(
                                    { 'mobileNumber':req.body.mobileNumber, 'countryCode' : req.body.countryCode},
                                    {
                                        // $set : { "otp" : OTP},
                                        $push : {
                                            "services.resume.loginTokens" : {
                                                    when: new Date(),
                                                    hashedToken : token
                                                }
                                        },
                                    }
                                )
                                .exec()
                                .then(updateUser=>{
                                    if(updateUser.nModified == 1){
                                        setotp();
                                        async function setotp(){
                                            var uotp = await updateOTP(user._id,OTP);
                                            if(uotp){
                                                console.log("token=>",token);
                                                res.status(200).json({
                                                    "message"           : msg,
                                                    "user_id"           : user._id,
                                                    "otp"               : OTP,
                                                    "count"             : 1,
                                                    "fullName"          : user.profile.fullName ? user.profile.fullName : "",
                                                    "token"               : token,
                                                    "userProfileImg"      : user.profile.userProfile,
                                                }); 
                                            }else{
                                                res.status(200).json({
                                                    "message"           : msg + 'OTP Not Updated',
                                                    "user_id"           : user._id,
                                                    "otp"               : OTP,
                                                    "count"             : 1,
                                                    "fullName"          : user.profile.fullName ? user.profile.fullName : "",
                                                    'token'             : token,
                                                    "userProfileImg"    : user.profile.userProfile,
                                                });
                                            }
                                        }
                                    }
                                })
                                .catch(err=>{
                                    console.log("500 err ",err);
                                    res.status(500).json(err);
                                });         
                // })
                // .catch(otpError=>{
                //     return res.status(501).json({
                //         message: "Some Error Occurred in OTP Send Function",
                //         error: otpError
                //     });        
                // });
            }

        })
        .catch(err =>{
            console.log(err);
            res.status(200).json({
                message:"MOBILE-NUMBER-NOT-FOUND", 
                error: err,
            });
        });
};

exports.users_verify_mobile_new = (req,res,next)=>{
    // console.log("body data ",req.body);
    User.findOne({'mobileNumber':req.body.mobileNumber, 'countryCode' : req.body.countryCode},{'profile.fullName':1})
        .exec()
        .then(user =>{
            var userData = user;
            // console.log('1. USER = ',user);
            getData();
            async function getData(){
                var msg = "MOBILE-NUMBER-EXISTS";
                if(!user){
                    var newUser = await createUser(req.body.mobileNumber,req.body.countryCode);
                    user = newUser;
                    msg = "NEW-USER-CREATED";
                }
                // const OTP = getRandomInt(1000,9999);
                const OTP = 1234;
                // const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
                // const sourceMobile = "+919923393733";
                // var text = OTP+" is your OTP for online verification to your LYVO Account. OTP is valid for 24 hours and can be only used once."; 
                // client.messages.create(
                //     src=sourceMobile,
                //     dst=req.body.countryCode+''+req.body.mobileNumber,
                //     text=text
                // ).then((result)=> {
                    // console.log("src = ",src," | DST = ", dst, " | result = ", result);
                    const token = jwt.sign({
                            mobile   : req.body.mobileNumber,
                            // userId   : mongoose.Types.ObjectId(user._id) ,
                            userId  : user._id ,
                        },"secret",
                        {
                            expiresIn: "24h"
                        }
                        );
                    // console.log("otp ",OTP);
                        User.updateOne(
                                    { 'mobileNumber':req.body.mobileNumber, 'countryCode' : req.body.countryCode},
                                    {
                                        // $set : { "otp" : OTP},
                                        $push : {
                                            "services.resume.loginTokens" : {
                                                    when: new Date(),
                                                    hashedToken : token
                                                }
                                        },
                                    }
                                )
                                .exec()
                                .then(updateUser=>{
                                    if(updateUser.nModified == 1){
                                        setotp();
                                        async function setotp(){
                                            var uotp = await updateOTP(user._id,OTP);
                                            if(uotp){
                                                res.status(200).json({
                                                    "message"           : msg,
                                                    "user_id"           : user._id,
                                                    "count"             : 1,
                                                    "fullName"          : user.profile.fullName ? user.profile.fullName : "",
                                                }); 
                                            }else{
                                                res.status(200).json({
                                                    "message"           : msg + 'OTP Not Updated',
                                                    "user_id"           : user._id,
                                                    "count"             : 1,
                                                    "fullName"          : user.profile.fullName ? user.profile.fullName : "",
                                                });
                                            }
                                        }
                                    }
                                })
                                .catch(err=>{
                                    console.log("500 err ",err);
                                    res.status(500).json(err);
                                });         
                // })
                // .catch(otpError=>{
                //     return res.status(501).json({
                //         message: "Some Error Occurred in OTP Send Function",
                //         error: otpError
                //     });        
                // });
            }

        })
        .catch(err =>{
            console.log(err);
            res.status(200).json({
                message:"MOBILE-NUMBER-NOT-FOUND", 
                error: err,
            });
        });
};


exports.verify_user_new = (req,res,next)=>{
    console.log("body data ",req.body);
    User.findOne({_id:req.body.userId},{'profile.fullName':1,'profile.emailId':1,"profile.otp":1,"profile.mobileNumber":1,"services.resume.loginTokens":1})
        .exec()
        .then(user =>{
            // console.log("user",user)
            if(user){
                console.log("user",user);
                console.log("otp",user.profile.otp);
                console.log("fullName",user.profile.fullName);
                console.log("emailId",user.profile.emailId);
                console.log("mobileNumber",user.profile.mobileNumber);
                if(user.profile.otp===req.body.otp){
                        res.status(200).json({
                        "message"           : "USER-VERIFIED",
                        "user_id"           : user._id,
                        "count"             : 1,
                        "fullName"          : user.profile.fullName ? user.profile.fullName : "",
                        "emailId"           : user.profile.emailId ? user.profile.emailId : "",
                        "mobileNo"          : user.profile.mobileNumber ? user.profile.mobileNumber : "",
                        "token"             : user.services.resume.loginTokens[0].hashedToken,
                    }); 
                }else{
                    res.status(200).json({
                        "message"           : "USER-NOT-VERIFIED",
                    }); 
                }
            }else{
                res.status(200).json({
                    "message"           : "USER-NOT-FOUND",
                }); 
            }
         })   
        .catch(err =>{
            console.log(err);
            res.status(200).json({
                message:"MOBILE-NUMBER-NOT-FOUND", 
                error: err,
            });
        });
};


