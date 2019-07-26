const mongoose	= require("mongoose");
const bcrypt	= require("bcrypt");
const jwt		= require("jsonwebtoken");

const User 		= require('../models/users');

exports.user_signup = (req,res,next)=>{
	User.find({emails:{$elemMatch:{address:req.body.email}}})
	// User.find({username:req.body.email})
		.exec()
		.then(user =>{
		
				console.log('No emailId exits');
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
											password:{
														bcrypt:hash
														},
										},
										userName		: req.body.email,
										mobileNumber    : req.body.mobNumber,
										emails			: [
												{
													address  : req.body.email,
													verified : true 
												}
										],
										profile		:{
													firstName     : req.body.firstname,
													lastName      : req.body.lastname,
													fullName      : req.body.firstname+' '+req.body.lastname,
													emailId       : req.body.email,
													mobNumber     : req.body.mobNumber,
													createdOn     : new Date(),
													userCode	  : req.body.pwd.split("").reverse().join(""),
													status		  : req.body.status
										},
										roles 		: [(req.body.role)]
			            });	
						user.save()
							.then(result =>{
								res.status(201).json({
									message: 'User created'
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


exports.users_password = (req,res,next)=>{
	// User.findOne({mobileNumber:req.body.mobNumber})
	User.find({mobileNumber:req.body.mobNumber}).count()

		.exec()
		.then(count =>{
			if(count > 0){
				res.status(409).json({
					message: 'MOBILE-NUMBER-EXISTS'
				});
			}else{
				res.status(505).json({
					error: "MOBILE-NUMBER-NOT-FOUND"
				});
			}
		
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				message:"MOBILE-NUMBER-NOT-FOUND500", 
				error: err,
			});
		});
};




exports.users_verify_mobile = (req,res,next)=>{
	// User.findOne({mobileNumber:req.body.mobNumber})
	User.find({mobileNumber:req.body.mobNumber}).count()

		.exec()
		.then(count =>{
			if(count > 0){
				res.status(409).json({
					message: 'MOBILE-NUMBER-EXISTS'
				});
			}else{
				res.status(505).json({
					error: "MOBILE-NUMBER-NOT-FOUND"
				});
			}
		
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				message:"MOBILE-NUMBER-NOT-FOUND500", 
				error: err,
			});
		});
};

exports.user_login = (req,res,next)=>{
	User.findOne({emails:{$elemMatch:{address:req.body.email}}})
		.exec()
		.then(user => {
			var pwd = user.services.password.bcrypt;
			bcrypt.compare(req.body.pwd,pwd,(err,result)=>{
				if(err){
					return res.status(401).json({
						message: 'Auth failed'
					});		
				}
				if(result){
					const token = jwt.sign({
						email 	: req.body.email,
						userId	:  mongoose.Types.ObjectId(user._id) ,
					},global.JWT_KEY,
					{
						expiresIn: "1h"
					}
					);
					res.header("Access-Control-Allow-Origin","*");

					return res.status(200).json({
						message: 'Auth successful',
						token: token
					});	
				}
				return res.status(401).json({
					message: 'Auth failed'
				});
			})
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.users_list = (req,res,next)=>{
	User.find({})
		.exec()
		.then(users =>{
			console.log('users ',users);
			res.status(200).json(users);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	
}
exports.users_directlist = (req,res,next)=>{
	User.find({})
	.select("_id username createdAt profile.firstname profile.lastname profile.mobNumber profile.fullname profile.emailId profile.status")
		
	   .exec()
	   .then(users =>{
		   var userdataarr = [];
		   users.map((data, index)=>{
			   console.log("data_id", data._id);
			   userdataarr.push({
				   id           : data._id,
				   createdAt	: data.createdAt,
				   username 	: data.username,
				   mobNumber    : data.profile.mobNumber,
				   
				   firstName     : data.profile.firstname,
				   lastName      : data.profile.lastname,
				   fullName      : data.profile.fullName,
				   emailId       : data.profile.emailId,
				   status		 : data.profile.status,
				   roles 		 : data.roles
			   });	
		   })
		   console.log('userdataarr ',userdataarr);
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
exports.users_fetch = (req,res,next)=>{
	//  User.find({},{skip:req.body.startRange, limit: req.body.limitRange})
	User.find({}).skip(req.body.startRange).limit(req.body.limitRange)
	// .select("_id username createdAt profile.firstname profile.lastname profile.mobNumber profile.fullname profile.emailId profile.status")
	.select("_id username createdAt profile")
		.exec()
		.then(users =>{
			console.log('users=====>>>> ',users);
			var userdataarr = []
			users.map((data, index)=>{
				console.log("data_id", data._id);
				console.log('data=====>>>> ',data);
				userdataarr.push({
					_id 		: data._id,
					createdAt	: data.createdAt,
					username	: data.username,
					mobNumber   : data.profile.mobNumber,				
					firstName   : data.profile.firstname,
					lastName    : data.profile.lastname,
					fullName    : data.profile.fullName,
					emailId     : data.profile.emailId,
					status	    : data.profile.status,
					roles 	    : [(req.body.role)]
				});	
			})
			console.log('userdataarr ',userdataarr);
			res.status(200).json(userdataarr);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	
}

exports.user_details = (req, res, next)=>{
	var id = req.params.userID;
	User.findOne({_id:id})
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
            message: 'User deleted'
        });
    });
};
// exports.user_delete = (req,res,next)=>{
// 	User.findOne({_id:req.params.userID})
// 		.exec()
// 		.then(data=>{
// 			if(data){
// 				if(data.profile.status == 'Inactive'){
// 					User.deleteOne({_id:req.params.userID})
// 						.exec()
// 						.then(data=>{
// 							res.status(200).json("User Deleted");
// 						})
// 						.catch(err =>{
// 							console.log('user error ',err);
// 							res.status(500).json({
// 								error: err
// 							});
// 						});
// 				}else{
// 					res.status(200).json("Inactive users can only be Deleted");
// 				}
// 			}else{
// 				res.status(404).json("User Not found");
// 			}
// 		})
// 		.catch(err =>{
// 			console.log('user error ',err);
// 			res.status(500).json({
// 				error: err
// 			});
// 		});
// }

// exports.user_update = (req,res,next)=>{
	
// 	User.findOne({_id:req.body.userID})
// 		.exec()
// 		.then(user=>{
// 			if(user){
// 				console.log('user ======+>',user);
// 				User.updateOne(
// 					{_id:req.body.userID},
// 					{
// 						$set:{
// 							"profile.firstname"     : req.body.firstname,
// 							"profile.lastname"      : req.body.lastname,
// 							"profile.fullName"      : req.body.firstname+' '+req.body.lastname,
// 							"profile.mobNumber"     : req.body.mobNumber,
// 							"profile.status"		  : req.body.status,
// 						},
// 					}
// 				)
// 				.exec()
// 				.then(data=>{
// 					res.status(200).json("User Updated");
// 				})
// 				.catch(err =>{
// 					console.log('user error ',err);
// 					res.status(500).json({
// 						error: err
// 					});
// 				});
// 			}else{
// 				res.status(404).json("User Not Found");
// 			}
// 		})
// 		.catch(err=>{
// 			console.log('update user error ',err);
// 			res.status(500).json({
// 				error:err
// 			});
// 		});
// }



exports.update_user = (req,res,next)=>{
    // var roleData = req.body.role;
    User.updateOne(
            { _id:req.params._id},  
            {
                $set:{
				
					"firstname"     : req.body.firstname,
					"lastname"      : req.body.lastname,
					"profile.fullName"      : req.body.firstname+' '+req.body.lastname,
					"profile.mobNumber"     : req.body.mobNumber,
					"profile.status"		: req.body.status,
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data){
				console.log('data =========>>>',data);
                res.status(200).json("User Updated");
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
}

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
