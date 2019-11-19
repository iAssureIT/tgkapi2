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
    								meetingDate        : String, //YYYY-MM-DD
                                    meetingTime        : String, //HH:MM AM 
    								remark 		       : String,
                                    meetingStatus      : String, //Scheduled, WIP, Completed, Cancelled   
    							}],
    query 					: [{
    								remark 		: String,
    								createdAt	: Date,
    								agentRole	: { type: mongoose.Schema.Types.ObjectId, ref: 'roles' },
    								agentID 	: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
    							}],
    status 					: String,  //New , MeetingSet ,Discarded, Shortlisted, TokenReceived, ContractDue, ContractCompleted, Delete
    tokenReceived 			: {
    								tockenAmount 		: Number,
    								tokenDate           : String,
    								tokenremark	        : String, 
    						  },
    contractDue 			: {
                                    contractDate        : String, //YYYY-MM-DD
                                    contractEndDate     : String, //YYYY-MM-DD
    								contractRemark      : String,
                                    contractTime        : String, //HH:MM AM/PM
    						  },
    updatedAt               : Date,
});

module.exports = mongoose.model('interestedProps',interestedPropsSchema);
