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
    
    Fcount1                 : String,
    setCount1               : String,
    formFillPrecentage1     : String,

    Fcount2                 : String,
    setCount2               : String,
    formFillPrecentage2     : String,

    Fcount3                 : String,
    setCount3               : String,
    formFillPrecentage3     : String,

    Fcount4                 : String,
    setCount4               : String,
    formFillPrecentage4     : String,


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
                                    coordinates         : {
                                        latitude  : Number,
                                        longitude : Number,
                                    },
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
    salesAgent              : [{
                                   agentID    :  { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
                                   createdAt  : Date,
                                   status     : String, //"Active" or "Inactive"
                               }],
    fieldAgent              : [{
                                   agentID    :  { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
                                   agentName  : String,
                                   createdAt  : Date,
                                   status     : String, //"Active" or "Inactive"
                               }],
    perComplete             : Number,
    updatedAt               : Date,
    createdAt               : Date,
    createdAtStr            : String,

});

module.exports = mongoose.model('properties',propertiesSchema);
