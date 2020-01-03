const mongoose = require('mongoose');

const tracklocationSchema = mongoose.Schema({
	_id					: mongoose.Schema.Types.ObjectId,
	latitude            : Number,
    longitude           : Number,
    routeCoordinates    : Array,
    distanceTravelled   : Number,
    createdAt   		: Date,
});

module.exports = mongoose.model('tracklocation',tracklocationSchema);


