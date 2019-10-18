const mongoose = require('mongoose');

const interestedPropsSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId, 
    buyer_id                : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    property_id             : { type: mongoose.Schema.Types.ObjectId, ref: 'properties' },
    createdAt               : Date,
   
});

module.exports = mongoose.model('interestedProps',interestedPropsSchema);
