// const mongoose = require('mongoose');

// const tgkuserSchema = mongoose.Schema({
// 	_id			: mongoose.Schema.Types.ObjectId,
// 	createdAt	: {type:Date},
// 	services	: {
// 		password:{
// 					bcrypt:String
// 				  },
// 		resume: {
// 			loginTokens:[
// 				{
// 					when: Date,
// 					hashedToken : String
// 				}
// 			]
// 		}
// 	},
// 	username	 	: {type:String},
// 	emails		 	: [
// 			{
// 				address:{type:String},
// 				verified: Boolean
// 			}
// 	],
// 	profile :{
// 		firstname 		: String,
// 		lastname  		: String,
// 		fullName  		: String,
// 		emailId   		: String,
// 		mobileNumber 	: String, 
// 		countryCode  	: String,
// 		profilepic		: String,
// 		pwd 			: String,
// 		status			: String,
// 		otp 			: Number,
// 		city 			: String,
// 	},
// 	roles 				: [String],
// 	officeLocation 		: String,
// 	heartbeat 			: Date
// });

// module.exports = mongoose.model('tgkusers',tgkuserSchema);
