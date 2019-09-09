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
    statusArray             : Array,
    status                  : String,
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
                                    bedrooms            : Number,
                                    balconies           : String,
                                    bathrooms           : String,
                                    ageofProperty       : String,
                                    facing              : String,                                 
                                    superArea           : Number,
                                    builtupArea         : String,
                                    washrooms           : String,
                                    personal            : String,
                                    pantry              : String,
                                    availableFrom       : Date,
                                   
                                },
    Amenities               :   Array,
    gallery                 :   {
                                    Images                  :   Array,
                                    video                   :   String,
    
                                },
   
    financial               :   {
                                    expectedRate        : Number,
                                    totalPrice          : Number,
                                    includeCharges      : Array,
                                    maintenanceCharges  : Number,
                                    maintenancePer      : String,
                                    description         : String,
                                    availableFrom       : String,
                                    depositAmount       : Number,
                                    monthlyRent         : Number,
                                },    
    avalibilityPlanVisit       : {
                                    contactPerson         : String,
                                    contactPersonMobile   : String,
                                    available             : Array,
                                    
                                   
                                },
    propertyCreatedAt   : Date,
    index               : String,

});

module.exports = mongoose.model('properties',propertiesSchema);
