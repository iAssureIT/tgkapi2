const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
	_id			: mongoose.Schema.Types.ObjectId,
    role        : String,
    createdAt   : Date,
});

module.exports = mongoose.model('roles',roleSchema);
