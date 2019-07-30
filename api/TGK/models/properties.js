const mongoose = require('mongoose');

const propertiesSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    propertyCode            : Number,
    owner_id                : String,
    propertyHolder          : String,
    transactionType         : String,
    propertyType            : String,
    propertySubType         : String,
    floor                   : String,
    totalFloor              : String,
    listing                 : Boolean,
    propertyLocation        : {
                                    address             : String,
                                    society             : String,
                                    subArea             : String,
                                    area                : String,
                                    landmark            : String,
                                    city                : String,
                                    block               : String,
                                    district            : String,
                                    state               : String,
                                    country             : String,
                                    pincode             : String,
                                },
                            
    propertyDetails         :   {
                                    furnishedStatus     : String,
                                    bedrooms            : String,
                                    balconies           : String,
                                    bathrooms           : String,
                                    ageofProperty       : String,
                                    facing              : String,                                 
                                    superArea           : String,
                                    builtupArea         : String,
                                    availableFrom       : Date,
                                    description         : String,
                                },
    Amenities               :   Array,
    Images                  :   Array,
    video                   :   String,

    financial               :   {
                                    expectedRate        : String,
                                    totalPrice          : String,
                                    includeCharges      : Array,
                                    maintenanceCharges  : String,
                                    maintenancePer      : String,
                                },    
    avalibilityPlanVisit       : {
                                    contactPerson         : String,
                                    contactPersonMobile   : String,
                                    available             : Array,
                                   
                                },
    status              : Array,
    propertyCreatedAt   : Date,

});

module.exports = mongoose.model('properties',propertiesSchema);
