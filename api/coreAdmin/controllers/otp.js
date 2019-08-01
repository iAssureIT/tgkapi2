// const bcrypt		= require("bcrypt");
// const jwt			= require("jsonwebtoken");

const plivo = require('plivo');
const User 		= require('../models/users');
const mongoose	= require("mongoose");


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.user_signup = (req,res,next)=>{
    console.log("Request = ",req.body);
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
            console.log('user ',user);
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


exports.users_verify_mobile = (req,res,next)=>{
	console.log("req.body.mobile-Number",req.body.mobileNumber);
	console.log("req.body.countryCode",req.body.countryCode);
	User.find({'mobileNumber':req.body.mobileNumber, 'countryCode' : req.body.countryCode})
		.limit(1)
		.exec()
		.then(user =>{
			console.log('1. USER = ',user);
			console.log('2. USER length = ',user.length);
			if(user.length > 0){
				const OTP = getRandomInt(1000,9999);
				User.updateOne(
					{ _id: user[0]._id},  
					{
						$set:{
							"otp" : OTP,
						}
					})
				.exec()
				.then( data =>{
					if(data){
						console.log('USER AFTER OTP GENERATED = ',data);
                        const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
                        const sourceMobile = "+919923393733";
                        var text = "Dear User, "+'\n'+"To verify your account on TGK, Enter this verification code : \n"+OTP; 
                        client.messages.create(
							src=sourceMobile,
							dst=req.body.countryCode+''+req.body.mobileNumber,
							text=text
						).then((result)=> {
							console.log("src = ",src," | DST = ", dst, " | result = ", result);
                            // return res.status(200).json("OTP "+OTP+" Sent Successfully ")
                            return res.status(200).json({
                                "message" : 'MOBILE-NUMBER-EXISTS',
                                "user_id" : user[0]._id,
                                "otp"     : OTP,
                                "count"   : user.length,
                            });			
                        })
                        
						.catch(otpError=>{
							return res.status(500).json({
                                messge: "Some issue happened in OTP Send Function",
								error: otpError
							});        
						});       
					}
				})
				.catch(err =>{
					console.log(err);
					res.status(500).json({
                        message : "Some problem occured in User Update for OTP",
						error: err
					});
				});			
			}else{
                const OTP = getRandomInt(1000,9999);
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    createdAt		: new Date,                    
                    mobileNumber  : req.body.mobileNumber,
                    countryCode   : req.body.countryCode,                                  
                    profile		: {                            
                                mobileNumber  : req.body.mobileNumber,
                                countryCode   : req.body.countryCode,                              
                                otp 		  : OTP,                                            
                    },
                    roles   : [req.body.roles],
                    status  : req.body.status,
                });
                user.save()
                .then(newUser =>{
                    if(newUser){
                        console.log('New USER = ',newUser);
                        // console.log('Plivo Client = ',mobileNumber);
                        const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
                        const sourceMobile = "+919923393733";
                        var text = "Dear User, "+'\n'+"To verify your account on TGK, Enter this verification code : \n"+OTP; 
        
                        client.messages.create(
                            src=sourceMobile,
                            dst=req.body.countryCode+''+req.body.mobileNumber,
                            text=text
                        ).then((result)=> {
                            console.log("src = ",src," | DST = ", dst, " | result = ", result);
                            // return res.status(200).json("OTP "+OTP+" Sent Successfully ");
                            return res.status(200).json({
                                "message" : 'NEW-USER-CREATED',
                                "user_id" : newUser._id,
                                "otp"     : OTP,
                            });			
                        })
                        .catch(otpError=>{
                            return res.status(501).json({
                                message: "Some Error Occurred in OTP Send Function",
                                error: otpError
                            });        
                        });       
                    }
                    
                })	
				// res.status(200).json({
				// 	message:"MOBILE-NUMBER-NOT-FOUND", 
				// 	count : user.length,
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





// exports.signup_generate_otp = (req,res,next)=>{

// 	let client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
// 	let sourceMobile = "+919923393733";
// 	let OTP = getRandomInt(1000,9999);
	
// 	console.log("OTP Generated = ",OTP);

//     var text = "Hello "+','+'\n'+"To verify your account on TGK, Enter this verification code : "+OTP; 


// 	// var roleData = req.body.role;
// 	User.updateOne(
//             { _id:req.body.user_id},  
//             {
//                 $set:{
//                     "otp" : OTP,
//                 }
//             }
//         )
//         .exec()
//         .then( data =>{
//             console.log('data ',data);
//             if(data){
//                 console.log('data =========>>>',data);

//                 client.messages.create(
//                     src=sourceMobile,
//                     dst=req.body.countrycode + req.body.mobile,
//                     text=text
                    
//                 ).then((result)=> {
//                     // console.log("src+++++>>>>>",src);
//                     // console.log("dst+++++>>>>>",dst);
//                     // console.log("RESULT+++++>>>>>",result);
//                     // console.log("RESULT+++++>>>>>",result);
//                     return res.status(200).json("OTP "+OTP+" Sent Successfully ");
//                 })
//                 .catch(otpError=>{
//                     return res.status(500).json({
//                         error: otpError
//                     });        
//                 });       
//             }
//         })
//         .catch(err =>{
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// }


// exports.login_otp_verifications = (req,res,next)=>{
//     User.findOne(
//         {'mobileNumber':req.body.mobileNumber}   
//     )
//     .exec()
//     .then( data =>{
//         console.log('data ',data);
//         if(data.otp == req.body.otp){
//             res.status(200).json({
//                 message: 'OTP-VERIFIED'
//             });
//         }else{
//             res.status(505).json({
//                 error: "OTP-NOT-VERIFIED"
//             });
//         }
      
//     })
//     .catch(err =>{
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     });    
// }
