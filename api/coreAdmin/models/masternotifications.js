
var mongoose = require('mongoose');
// Setup schema
var masternotificationsSchema = mongoose.Schema({
	templateType : String,
	templateName : String,
	subject      : String,
	content      : String
});
module.exports = mongoose.model('masternotifications', masternotificationsSchema);
