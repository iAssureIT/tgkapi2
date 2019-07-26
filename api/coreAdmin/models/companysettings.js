const mongoose = require('mongoose');

const companysettingsSchema = mongoose.Schema({
	_id			 : mongoose.Schema.Types.ObjectId,
    companyId              : Number,
    companyName            : String,
    companyContactNumber   : String,
    companyMobileNumber    : String,
    companyEmail           : String,
    companyAltEmail        : String,
    companywebsite         : String,
    companyaddress         : String,
    city                   : String,
    country                : String,
    state                  : String,
    district               : String,
    pincode                : String,
    taluka                 : String,
    logoFilename           : String,
    companyUniqueID        : String,
    companyLogo            : String,
    companyLocationsInfo   : [
                                {
                                    Location        : String,
                                    contactnumber   : String,
                                    blockname       : String,
                                    landmark        : String,
                                    companyDistrict : String,
                                    companyPincode  : String,
                                    companyCity     : String,
                                    companyState    : String,
                                    companyCountry  : String,
                                    companytaluka   : String,
                                }
                            ],
    bankDetails             : [
                                {
                                    accHolderName : String,
                                    accNickName   : String,
                                    bankName      : String,
                                    accType       : String,
                                    branchName    : String,
                                    accNumber     : String,
                                    ifscCode      : String,
                                }
                            ],
    taxSettings             : [
                                {
                                    taxType         : String,
                                    taxRating       : String,
                                    effectiveFrom   : Date,
                                    createdAt       : Date,
                                }
                            ]
});

module.exports = mongoose.model('companysettings',companysettingsSchema);
