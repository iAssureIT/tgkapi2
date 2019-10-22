const mongoose = require('mongoose');

const interestedPropsSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId, 
    buyer_id                : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    property_id             : { type: mongoose.Schema.Types.ObjectId, ref: 'properties' },
    createdAt               : Date,
    fieldAgent              : [{
                                   agentID    :  { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
                                   createdAt  : Date,
                                   status     : String, //"Active" or "Inactive"
                                   remark 	  : String
                               }],
    meeting 				: [{
    								meetingDate : Date,
    								remark 		: String,
    							}],
    query 					: [{
    								remark 		: String,
    								createdAt	: Date,
    								agentRole	: { type: mongoose.Schema.Types.ObjectId, ref: 'roles' },
    								agentID 	: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
    							}],
    status 					: String, // "Interested" , Meeting , Shown , Shortlisted, Token_Received, Contract_Due, Cancelled, Completed 
    token_received 			: {
    								amount 		: Number,
    								receivedAt  : Date,
    								remark		: String, 
    							},
    Contract_Due 			: {
    								dueDate : String,
    								remark  : String,
    							}

   
});

module.exports = mongoose.model('interestedProps',interestedPropsSchema);
