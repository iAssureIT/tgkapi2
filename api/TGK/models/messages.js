const mongoose = require('mongoose');

const messagesSchema = mongoose.Schema({
    _id       : mongoose.Schema.Types.ObjectId,
    prop_id   : { type: mongoose.Schema.Types.ObjectId, ref: 'properties' },
    trans_id  : { type: mongoose.Schema.Types.ObjectId, ref: 'interestedprops' }, 
    messages  : [{
                     user_id      : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
                     text         : String,
                     image        : String,
                     createdAt    : Date,
                }]
});

module.exports = mongoose.model('messages',messagesSchema);
