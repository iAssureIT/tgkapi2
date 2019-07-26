const mongoose = require('mongoose');

const mastersellometerSchema = mongoose.Schema({
	_id			: mongoose.Schema.Types.ObjectId,
    class		: String,
    earnings    : String,
    createdAt   : Date,
});

module.exports = mongoose.model('mastersellometer',mastersellometerSchema);
