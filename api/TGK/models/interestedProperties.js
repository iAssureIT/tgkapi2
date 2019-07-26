const mongoose = require('mongoose');

const interestedPropsSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId, 
    buyer_id                : String,
    property_id             : String,
    createdAt               : Date,
   
});

module.exports = mongoose.model('interestedProps',interestedPropsSchema);
