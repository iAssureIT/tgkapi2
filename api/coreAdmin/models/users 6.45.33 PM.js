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
	username	: {type:String},
	mobileNumber : String, 
	emails		: [
			{
				address:{type:String},
				verified: Boolean
			}
	],
	profile :{
		firstname 		: String,
		lastname  		: String,
		fullName  		: String,
		emailId   		: String,
		mobNumber 		: String,
		profilepic		: String,
		pwd 			: String,
		status			: String,
	},
	roles : [String],
	heartbeat : Date
});

module.exports = mongoose.model('users',userSchema);
