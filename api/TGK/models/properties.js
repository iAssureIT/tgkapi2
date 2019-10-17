const mongoose = require('mongoose');

const propertiesSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    propertyCode            : Number,
    owner_id                : String,
    propertyHolder          : String,
    transactionType         : String,
    propertyType            : String,
    propertySubType         : String,
    statusArray             : Array,
    status                  : String,
    listing                 : Boolean,
    ownerDetails            : {
                                userName     : String,
                                emailId      : String,
                                mobileNumber : String,
                            },
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
                                    floor               : String,
                                    totalFloor          : String,
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
                                    Amenities           : Array,
                                    superAreaUnit       : String,
                                    builtupAreaUnit     : String,
                                    furnishedOptions    : Array,
                                    workStation         : String,
                                    furnishPantry       : String,
                                },
    gallery                 :   {
                                    Images                  :   Array,
                                    video                   :   String,
    
                                },
   
    financial               :   {
                                    expectedRate        : Number,
                                    measurementUnit     : String,
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
    propertyCreatedAt       : Date,
    index                   : String,
    salesAgent_id           : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    perComplete             : Number,
    updatedAt               : Date

});

module.exports = mongoose.model('properties',propertiesSchema);
