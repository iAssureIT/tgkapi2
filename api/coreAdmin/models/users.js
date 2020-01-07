const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id			: mongoose.Schema.Types.ObjectId,
	createdAt	: {type:Date},
	services	: {
		password:{
					bcrypt:String
				  },
		resume: {
			loginTokens:[
				{
					when: Date,
					hashedToken : String
				}
			]
		}
	},
	username	 : {type:String},
	emails		 : [
							{
								address:{type:String},
								verified: Boolean
							}
					],
	mobileNumber  : String,
	countryCode   : String,
	profile :{
		firstName 		: String,
		lastName  		: String,
		fullName  		: String,
		// name 	 		: String,
		emailId   		: String,
		mobileNumber 	: String, 
		countryCode  	: String,
		profilepic		: String,
		pwd 			: String,
		status			: String,
		otp 			: Number,
		city 			: String,
		propertyCount	: Number,
		manager_id      : String,
	},
	roles 				: [String],
	officeLocation 		: { type: mongoose.Schema.Types.ObjectId, ref: 'tgkspecificcompanysettings.companyLocationsInfo._id' },
	heartbeat 			: Date,
	updateAt 			: Date,
});

module.exports = mongoose.model('users',userSchema);
