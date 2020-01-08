const mongoose		= require("mongoose");
const bcrypt		= require("bcrypt");
const jwt			= require("jsonwebtoken");
const plivo 		= require('plivo');
const User 			= require('../models/users');
const globalVariable 	= require('../../../nodemon.js');
var ObjectID = require('mongodb').ObjectID;

exports.user_signupadmin = (req,res,next)=>{
	console.log("user_signupadmin ",req.body);
	User.find()
		.exec()
		.then(user =>{
				bcrypt.hash(req.body.pwd,10,(err,hash)=>{
					if(err){
						return res.status(500).json({
							error:err
						});
					}else{
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							createdAt		: new Date,
							services		: {
								password	:{
											bcrypt:hash
											},
							},
							countryCode 	: req.body.countryCode,
							mobileNumber  	: req.body.mobileNumber,
							emails			: [
									{
										address  : req.body.email,
										verified : true 
									}
							],
							profile		:{
										firstName     : req.body.firstName,
										lastName      : req.body.lastName,
										fullName      : req.body.firstName+' '+req.body.lastName,
										emailId       : req.body.email,
										mobileNumber  : req.body.mobileNumber,
										countryCode   : req.body.countryCode,
										status		  : req.body.status,
										manager_id    : req.body.manager_id
							},
							roles 		   : (req.body.roles),
							officeLocation : req.body.officeLocation,
			            });	
						user.save()
							.then(result =>{
								res.status(201).json({
									message : "NEW-USER-CREATED",
									"user_id" : user._id,
                        			// "otp"     : OTP,
								})
							})
							.catch(err =>{
								console.log(err);
								res.status(500).json({
									error: err
								});
							});
					}			
				});
			
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};


//Reset password functionality
exports.update_user_resetpassword = (req,res,next)=>{
	// var roleData = req.body.role;
	bcrypt.hash(req.body.pwd,10,(err,hash)=>{
    User.updateOne(
            { _id:req.params.userID},  
            {
                $set:{
				
					services		: {
										password:{
												bcrypt:hash
												},
					},

					
					}			

            }
        )
        .exec()
        .then(data=>{
            // console.log('data ',data);
            if(data.nModified == 1){
				// console.log('data =========>>>',data);
                res.status(200).json("Password  Updated");
            }else{
                res.status(200).json("Password  Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
		});
	});
}

//user login
exports.user_login = (req,res,next)=>{
    // console.log('login');
    User.findOne({emails:{$elemMatch:{address:req.body.email}}})
        .exec()
        .then(user => {
            if(user){
                var pwd = user.services.password.bcrypt;
                if(pwd){
					// console.log('PWD',pwd);
                    bcrypt.compare(req.body.password,pwd,(err,result)=>{
                        if(err){
                            console.log('password err ',err);
                            return res.status(200).json({
                                message: 'Bcrypt Auth failed'
                            });     
                        }
                        if(result){
                            // console.log('result ',result);
                            const token = jwt.sign({
                                email   : req.body.email,
                                // userId   : mongoose.Types.ObjectId(user._id) ,
                                userId  : user._id ,
                            },globalVariable.JWT_KEY,
                            {
                                expiresIn: "365d"
                            }
                            );
                            User.updateOne(
										{ emails:{$elemMatch:{address:req.body.email}}},
										{
											$push : {
												"services.resume.loginTokens" : {
														when: new Date(),
														hashedToken : token
													}
											}
										}
									)
									.exec()
									.then(updateUser=>{
										if(updateUser.nModified == 1){
											// console.log("token = ",token);
											res.status(200).json({
												message             : 'Auth successful',
				                                token               : token,
				                                user_ID             : user._id,
												userFullName       	: user.profile.fullName,
												useremailId			: user.profile.emailId,						
												roles 				: user.roles,
				                                // userProfileImg      : user.profile.userProfile,
											});	
										}
									})
									.catch(err=>{
										console.log("500 err ",err);
										res.status(500).json(err);
									});
                        }
                        
                    })
                }else{
                    res.status(200).status({message:"Password not found"}); 
                }
            }else{
                res.status(200).status({message:"User Not found"});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

//show user list
exports.users_list = (req,res,next)=>{
	User.find({roles : {$ne : "admin"} })
		.exec()
		.then(users =>{
			// console.log('users ',users);
			res.status(200).json(users);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
}

//user list
exports.users_directlist = (req,res,next)=>{
	User.find({roles : {$ne : "admin"} })
	.select("_id username roles createdAt profile.firstName profile.lastName profile.mobNumber profile.fullname profile.emailId profile.status")
	   .exec()
	   .then(users =>{
			// console.log("List of Users", users);
		   var userdataarr = [];
		   users.map((data, index)=>{
			// console.log('data =======================>>>>>>>>>>>>',data);

			// console.log("data_id", data._id);
			   	userdataarr.push({
				   id            : data._id,
				   createdAt	 : data.createdAt,
				   username 	 : data.username,
				   mobNumber     : data.profile.mobNumber,
				   
				   firstName     : data.profile.firstName,
				   lastName      : data.profile.lastName,
				   fullName      : data.profile.name,
				   emailId       : data.profile.emailId,
				   status	     : data.profile.status,
				   roles 		 : data.roles
			   
				});	
		   })
		//    console.log('userdataarr ',userdataarrs);
		   if(userdataarr.length == users.length){
			res.status(200).json(userdataarr);
		   }
		   
	   })
	   .catch(err =>{
		   console.log(err);
		   res.status(500).json({
			   error: err
		   });
	   });
   
}

//user fetch
exports.users_fetch = (req,res,next)=>{
	User.find({roles : {$ne : "admin"} })
		.sort( { createdAt: -1 } ).skip(req.body.startRange).limit(req.body.limitRange)
		.select("_id username createdAt profile roles officeLocation")
		.exec()
		.then(users =>{			
			// console.log("fetch users = ",users);
			var userdataarr = []
			users.map((data, index)=>{
				userdataarr.push({
					_id 		: data._id,
					createdAt	: data.createdAt,
					username	: data.username,					
					mobileNumber  : data.profile.mobileNumber,				
					firstName   : data.profile.firstName,
					lastName    : data.profile.lastName,
					fullName    : data.profile.fullName,
					emailId     : data.profile.emailId,
					status	    : data.profile.status,
					roles 	    : (data.roles).toString(),
					officeLocation 	: data.officeLocation,
				});	
			})
			// console.log('userdataarr = ',userdataarr);
			res.status(200).json(userdataarr);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	
}


//user details
exports.user_details = (req, res, next)=>{
	var id = req.params.userID;
	User.findOne({_id:id})
		// .populate("officeLocation")
		// .select("profile")
		.exec()
		.then(users =>{
			res.status(200).json(users);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
}

// Handle delete contact
exports.delete_user = function (req, res,next) {
    User.deleteOne({
        _id: req.params.userID
    }, function (err) {
        if(err){
            return res.json({
                error: err
            });
        }
        res.json({
            status: "success",
            message: 'Users deleted'
        });
    });
};

//delete  all user functionality
exports.deleteall_user = function (req, res,next) {
    User.deleteMany({
       
    }, function (err) {
        if(err){
            return res.json({
                error: err
            });
        }
        res.json({
            status: "success",
            message: 'All Users deleted'
        });
    });
};

//update user
exports.update_user = (req,res,next)=>{
    User.updateOne(
            { _id:req.params.userID},  
            {
                $set:{
				
					"profile.firstName"     : req.body.firstName,
					"profile.lastName"      : req.body.lastName,
					"profile.fullName"      : req.body.firstName+' '+req.body.lastName,
					"profile.emailId"       : req.body.emailId,
					"profile.mobileNumber"  : req.body.mobileNumber,
					"roles" 				: (req.body.roles),
					"officeLocation" 		: req.body.officeLocation,

			
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){
				// console.log('data =========>>>',data);
                res.status(200).json("User Updated");
            }else{
                res.status(200).json("User Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

//Change user role
exports.user_change_role = (req,res,next)=>{
	User.findOne({_id:req.params.userID})
		.exec()
		.then(user=>{
			if(user){
				if(req.params.rolestatus == 'assign'){
					User.updateOne(
						{_id:req.body.userID},
						{
							$push:{
								roles : req.body.role
							}
						}
					)
					.exec()
					.then(data=>{
						res.status(200).json("Role Assigned");
					})
					.catch(err =>{
						console.log('user error ',err);
						res.status(500).json({
							error: err
						});
					});
				}else if(req.params.rolestatus == 'remove'){
					User.updateOne(
						{_id:req.body.userID},
						{
							$pull:{
								roles : req.body.role
							}
						}
					)
					.exec()
					.then(data=>{
						res.status(200).json("Role Removed");
					})
					.catch(err =>{
						console.log('user error ',err);
						res.status(500).json({
							error: err
						});
					});
				}
				console.log('user ',user);
			}else{
				res.status(404).json("User Not Found");
			}
		})
		.catch(err=>{
			console.log('update user error ',err);
			res.status(500).json({
				error:err
			});
		});
}


//=============================
exports.account_status= (req,res,next)=>{

	User.updateOne(
		{'_id': req.body.userID },
		{
			$set:{
				"profile.status": req.body.status ,
			} //End of set
		}
	)
	.exec()
	.then( data =>{
		
		return res.status(200).json({
			"message" : 'Status-Updated',
		});		
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}


exports.account_role_add= (req,res,next)=>{
	
	User.findOne({roles: req.body.roles})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Role is already exists'
				});
			}else{
				User.updateOne(
					{'_id': req.body.userID },
					{
						$push:{
							"roles": req.body.roles ,
						} //End of set
					}
				)
				.exec()
				.then( data =>{
					if(data){
					return res.status(200).json({
						"message" : 'Roles-Updated',
						// "data"    : data
					});		
					}else{
						return res.status(404).json({
							"message" : 'Roles-Not-Updated',
						
						});	
					}
				})
			}
        })
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}

exports.account_role_remove= (req,res,next)=>{
	User.updateOne(
		{'_id': req.body.userID },
		{
			$pull:{
				"roles": req.body.roles ,
			} //End of set
		}
	)
	
	.exec()
	.then( data =>{
		if(data){
		return res.status(200).json({
			"message" : 'Roles-Deleted',
			"data"    : data
		});		
		}else{
			return res.status(200).json({
				"message" : 'Roles-Not-Deleted',
			});	
		}
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}

exports.user_search = (req,res,next)=>{
	// console.log("req.body.searchText",req.body.searchText);

	User.find(
		{$or:[
			{"profile.fullName"		:	{ "$regex": req.body.searchText, $options: "i"}},
			{"profile.firstName"	:	{ "$regex": req.body.searchText, $options: "i"}},
			{"profile.lastName"		:	{ "$regex": req.body.searchText, $options: "i"}},
			{"profile.emailId"		:	{ "$regex": req.body.searchText, $options: "i"}},
			{"profile.mobileNumber"	:	{ "$regex": req.body.searchText, $options: "i"}},
			// {"roles"				:	{ "$regex": { $in: [req.body.searchText] }, $options: "i"}},
			{"roles"				:	{ $in: [req.body.searchText] }},
			{"profile.status"		:	{ "$regex": req.body.searchText, $options: "i"}},
		]},
		
	)
	.exec()
	.then( data =>{
		// console.log('data ',data);
		if(data.length > 0){
			return res.status(200).json({
				"message" : 'Search-Successfull',
					"data": data
			});		
		}else{
			return res.status(404).json({
				"message" : 'No-Data-Available',		
			});	
		}	
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			
			error: err
		});
	});
}

exports.search_user_office = (req,res,next)=>{
	// console.log("req.body.searchText",req.body.searchText);

	User.find(
		{$or:[
			{"officeLocation"		:	{ "$regex": req.body.searchText, $options: "i"}},
			
		]},
		
	)
	.exec()
	.then( data =>{
		// console.log('data ',data);
		if(data.length > 0){
			return res.status(200).json({
				"message" : 'Search-Successfull',
					"data": data
			});		
		}else{
			return res.status(404).json({
				"message" : 'No-Data-Available',		
			});	
		}	
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			
			error: err
		});
	});
}
exports.users_count = (req,res,next)=>{
	User.find().count()
	// .countDocuments()
	.exec()
	.then( data =>{
		// console.log('data ',data);
		if(data){
			return res.status(200).json({
				"message" : 'Count',
				"data": data
			});		
		}else{
			return res.status(404).json({
				"message" : 'No-Data-Available',		
			});	
		}	
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			
			error: err
		});
	});
}
///////////////////////Anagha's Code//////////////////////////////////////
exports.user_login_role = (req,res,next)=>{
    // console.log('login');
    // User.findOne({emails:{$elemMatch:{address:req.body.email}},"roles" : req.body.role})
    User.findOne({emails:{$elemMatch:{address:req.body.email}}})
        .exec()
        .then(user => {
            if(user){
                var pwd = user.services.password.bcrypt;
                if(pwd){
					// console.log('PWD',pwd);
                    bcrypt.compare(req.body.password,pwd,(err,result)=>{
                        if(err){
                            console.log('password err ',err);
                            return res.status(200).json({
                                message: 'Bcrypt Auth failed'
                            });     
                        }
                        if(result){
                            // console.log('result ',result);
                            const token = jwt.sign({
                                email   : req.body.email,
                                // userId   : mongoose.Types.ObjectId(user._id) ,
                                userId  : user._id ,
                            },globalVariable.JWT_KEY,
                            {
                                expiresIn: "23h"
                            }
                            );
                            User.updateOne(
										{ emails:{$elemMatch:{address:req.body.email}}},
										{
											$push : {
												"services.resume.loginTokens" : {
														when: new Date(),
														hashedToken : token
													}
											}
										}
									)
									.exec()
									.then(updateUser=>{
										if(updateUser.nModified == 1){
											// console.log("token = ",token);
											res.status(200).json({
												message             : 'Auth successful',
				                                token               : token,
				                                user_ID             : user._id,
												userFullName       	: user.profile.fullName,
												useremailId			: user.profile.emailId,						
												roles 				: user.roles,
				                                // userProfileImg      : user.profile.userProfile,
											});	
										}
									})
									.catch(err=>{
										console.log("500 err ",err);
										res.status(500).json(err);
									});
                        }
                        
                    })
                }else{
                    res.status(200).status({message:"Password not found"}); 
                }
            }else{
                res.status(200).status({message:"User Not found"});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.user_details_withLocName = (req,res,next)=>{
	var id = req.params.userID;
	User.aggregate([
						{
							$match : {
										_id : ObjectID(id)
									}
						},
						{
							$lookup : {
											from: "tgkspecificcompanysettings",
									       	localField: "officeLocation",
									       	foreignField: "companyLocationsInfo._id",
									       	as: "csdata"	
									}
						},
						{
							$unwind : "$csdata"
						},
						{
							$unwind : "$csdata.companyLocationsInfo"
						},
						{
							$project : {
										"_id" 				: 1,
										"services"			: 1,
										"roles"				: 1,
										"createdAt"			: 1,
										"countryCode"		: 1,
										"mobileNumber"		: 1,
										"emails"			: 1,
										"profile"			: 1,
										"officeLocation"	: 1,
										"officeLocationID"	: "$csdata.companyLocationsInfo._id",
										"officeName"	: "$csdata.companyLocationsInfo.officeLocationid"
									}
						},
						// {
						// 	$match : {
						// 				"officeLocation" : "$officeLocationID"
						// 			}
						// }
					])
		.exec()
		.then(users =>{
			for(j = 0 ; j < users.length ; j++){
				console.log("j ",j);
				// console.log("users[j].officeLocation ",users[j].officeLocation);
				// console.log("users[j].csdata.companyLocationsInfo._id ",users[j].csdata.companyLocationsInfo._id);

				if(String(users[j].officeLocation) == String(users[j].officeLocationID)){
					res.status(200).json(users[j]);
				// 	// break;
				}
			}
			// if(j >= users.length){
				// res.status(200).json(users);
			// }
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

//Get Managers list and allocated agents Data
exports.managers_list = (req,res,next)=>{

	User.aggregate([
				{
					$match:{
						roles : req.params.managerRole
					}
				},
				{
					$lookup:{
						from 			: "users",
						localField 		: "_id",
						foreignField 	: "profile.manager_id",
						as 				: "agents"
					}
				},
				{
					$unwind : "$agents"
				},
				{
					$project:{
						"_id"			: "$_id",
						"managerName"   : "$profile.fullName",
						"agent_id"		: "$agents._id",
						"agentName"		: "$agents.profile.fullName"
					}
				}
		])
		.exec()
		.then(data=>{
			res.status(200).json(data);
		})
		.catch(err=>{
			res.status(200).json("error ",err)
		})
	// User.find({roles : req.params.managerRole})
	// .populate('profile.manager_id')
	// .exec()
	// .then(managerList =>{
	// 	console.log("managerList",managerList);
	// 	// var agentManagerList = [];
	// 	// 	for (var i = managerList.length - 1; i >= 0; i--) {
	// 	// 		console.log("managerList=>",managerList[i]._id)
	// 	// 		User.find({"profile.manager_id" : managerList[i]._id})
	// 	// 		.exec()
	// 	// 		.then(agentsList =>{
	// 	// 			if(agentsList && agentsList.length>0){
	// 	// 				agentManagerList.push({
	// 	// 					managerId 	: managerList[i]._id,
	// 	// 					managerName : managerList[i].profile.fullName,
	// 	// 					fieldAgents : agentsList,
	// 	// 				})
	// 	// 			}	
	// 	// 		})
	// 	// 		.catch(err =>{
	// 	// 			console.log(err);
	// 	// 			res.status(500).json({
	// 	// 				error: err
	// 	// 			});
	// 	// 		});
	// 	// 	}
	// 	// 	if(i >= managerList.length){
 //  //               res.status(200).json(agentManagerList);
 //  //           }
	// })
	// .catch(err =>{
	// 	console.log(err);
	// 	res.status(500).json({
	// 		error: err
	// 	});
	// });
};
