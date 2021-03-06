exports.users_verify_mobile = (req,res,next)=>{
	console.log("req.body.mobile-Number",req.body.mobileNumber);
	console.log("req.body.countryCode",req.body.countryCode);
	User.find({'mobileNumber':req.body.mobileNumber, 'countryCode' : req.body.countryCode},{'profile.fullName':1})
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
                        var text = OTP+" is your OTP for online verification to your LYVO Account. OTP is valid for 24 hours and can be only used once."; 
                        client.messages.create(
							src=sourceMobile,
							dst=req.body.countryCode+''+req.body.mobileNumber,
							text=text
						).then((result)=> {
							console.log("src = ",src," | DST = ", dst, " | result = ", result);
                            // return res.status(200).json("OTP "+OTP+" Sent Successfully ")
                            return res.status(200).json({
                                "message"  : 'MOBILE-NUMBER-EXISTS',
                                "user_id"  : user[0]._id,
                                "otp"      : OTP,
                                "count"    : user.length,
                                "fullName" : user[0].profile.fullName ? user[0].profile.fullName : ""
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
                        var text = OTP+" is your OTP for online verification to your LYVO Account. OTP is valid for 24 hours and can be only used once."; 
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