const mongoose = require('mongoose');

const masteramenitiesSchema = mongoose.Schema({
	_id			: mongoose.Schema.Types.ObjectId,
    amenity     : String,
    createdAt   : Date,
});

module.exports = mongoose.model('masteramenities',masteramenitiesSchema);
