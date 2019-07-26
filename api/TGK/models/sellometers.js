const mongoose = require('mongoose');

const sellometersSchema = mongoose.Schema({
	_id				: mongoose.Schema.Types.ObjectId,
	city			: String, 
	area			: String,
	subArea			: String, 
	socity			: String, 
	propertyClass 	: String,
	index 			: String,
    createdAt   	: Date,
});

module.exports = mongoose.model('sellometers',sellometersSchema);


