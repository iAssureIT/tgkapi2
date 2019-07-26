const mongoose	= require("mongoose");

const TgkSpecificCompanysettings = require('../../models/tgkspecific/tgkSpecificcompanysettings');

exports.create_companysettings = (req,res,next)=>{
	TgkSpecificCompanysettings.find()
		            .exec()
		            .then(data =>{
                        var companyId  = data.length + 1;
                        
                        const tgkSpecificCompanysettings = new TgkSpecificCompanysettings({
                                _id                    : new mongoose.Types.ObjectId(),
                                companyId              : companyId,
                                companyName            : req.body.companyName,
                                companyContactNumber   : req.body.companyContactNumber,
                                companyMobileNumber    : req.body.companyMobileNumber,
                                companyEmail           : req.body.companyEmail,
                                companyAltEmail        : req.body.companyAltEmail,
                                companywebsite         : req.body.companywebsite,
                                companyaddress         : req.body.companyaddress,
                                city                   : req.body.city, 
                                country                : req.body.country,
                                state                  : req.body.state,
                                district               : req.body.district,
                                pincode                : req.body.pincode,
                                taluka                 : req.body.taluka,
                                logoFilename           : req.body.logoFilename,
                                companyUniqueID        : req.body.companyUniqueID,
                                companyLogo            : req.body.companyLogo,
                                // companyLocationsInfo   : [
                                //                             {
                                                               
                                //                                 Location        : req.body.Location,
                                //                                 contactnumber   : req.body.contactnumber,
                                //                                 blockname       : req.body.blockname,
                                //                                 landmark        : req.body.landmark,
                                //                                 companyDistrict : req.body.companyDistrict,
                                //                                 companyPincode  : req.body.companyPincode,
                                //                                 companyCity     : req.body.companyCity,
                                //                                 companyState    : req.body.companyState,
                                //                                 companyCountry  : req.body.companyCountry,
                                //                                 companytaluka   : req.body.companytaluka,
                                //                                 pincodeServed   : req.body.pincodeServed
                                //                             }
                                //                         ],
                                // bankDetails             : [
                                //                             {
                                //                                 accHolderName : req.body.accHolderName,
                                //                                 accNickName   : req.body.accNickName,
                                //                                 bankName      : req.body.bankName,
                                //                                 branchName    : req.body.branchName,
                                //                                 accType       : req.body.accType,
                                //                                 accNumber     : req.body.accNumber,
                                //                                 ifscCode      : req.body.ifscCode,
                                //                             }
                                //                         ],
                                // taxSettings             : [
                                //                             {
                                //                                 taxType         : req.body.taxType,
                                //                                 taxRating       : req.body.taxRating,
                                //                                 effectiveFrom   : req.body.effectiveFrom,
                                //                                 // effectiveTo     : req.body.effectiveTo,
                                //                                 createdAt       : new Date(),
                                //                             }
                                //                         ]
                        });
                        tgkSpecificCompanysettings.save()
                                        .then(data=>{
                                            res.status(200).json("CompanySetting-Added");
                                        })
                                        .catch(err =>{
                                            console.log(err);
                                            res.status(500).json({
                                                error: err
                                            });
                                        });
		            })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
};

exports.detail_companysettings = (req,res,next)=>{
    TgkSpecificCompanysettings.findOne({companyId:req.params.companysettingsID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
              
            }else{
                res.status(404).json('Company Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.detail_companysettings_locations = (req,res,next)=>{
    TgkSpecificCompanysettings.find({ "companyId" : req.body.companyId, 
                                      "companyLocationsInfo._id" : req.body.locationID},
                                      {"companyLocationsInfo.$" : 1}).sort( { createdAt: -1 } )
        .exec()
        .then(data=>{
            console.log("data = ",data);            
            if(data){
                // res.status(200).json(data);
                res.status(200).json({
                    "message"        : 'Company-Setting-Location-List',
                    "companyId"      : data.companyId,
                    "data"           : data
                    });

            }else{
                res.status(200).json('Company Details not found for company ID = '+req.body.companyId);
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.list_companysettings = (req,res,next)=>{
    console.log('list');
    TgkSpecificCompanysettings.find({})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Company Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_companysettings = (req,res,next)=>{
    var info = req.params.info;
    var action = req.params.action;
    console.log('update cs ',info, ' ,',action,' ,',req.body.companyId);
    console.log("I am in update1");
    switch(action){
        case 'add' :
            switch(info){
                case 'location':
                    //  console.log("I am in switch");
                    //  console.log("I am in req.body.companyId",req.body);
                     
                     var data = TgkSpecificCompanysettings.find({companyId : req.body.companyId})
                    //  console.log("DATA==>",data);
                    //  var Locationid = companyLocationsInfo.length + 1;
                     
                     
                     TgkSpecificCompanysettings.updateOne(

                        { companyId : req.body.companyId},  
                        {
                            $push:{
                                companyLocationsInfo : {
                                    // Locationid    : Locationid,
                                    Location         : req.body.Location,
                                    contactnumber    : req.body.contactnumber,
                                    blockname        : req.body.blockname,
                                    areaName         : req.body.areaName,
                                    landmark         : req.body.landmark,
                                    companyDistrict  : req.body.companyDistrict,
                                    companyPincode   : req.body.companyPincode,
                                    companyCity      : req.body.companyCity,
                                    companyState     : req.body.companyState,
                                    companyCountry   : req.body.companyCountry,
                                    companytaluka    : req.body.companytaluka,
                                    pincodesCovered  : req.body.pincodesCovered,
                                    officeLocationid : req.body.companyCity+'-'+req.body.areaName+'-'+"Field-Office",
                                }
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                   
                        console.log('data ',data);
                        if(data.nModified == 1){
                            res.status(200).json("Company Locations Details added");
                        }else{
                            res.status(404).json("Company Locations Not found");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });  
                    break;              
                case 'tax' :
                console.log("I am in req.body.companyId",req.body.companyId);

                TgkSpecificCompanysettings.updateOne(
                        { companyId : req.body.companyId},  
                        {
                            $push:{
                                taxSettings : {
                                    taxType         : req.body.taxType,
                                    taxRating       : req.body.taxRating,
                                    effectiveFrom   : req.body.effectiveFrom,
                                    createdAt       : new Date(),
                                }
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data.nModified == 1){
                            res.status(200).json("Company Tax Details added");
                        }else{
                            res.status(404).json("Company Tax Not found");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });  
                    break;
                case 'bank' :
                console.log("I am in switch bank");
                console.log("companyID===>",req.body.companyId);

                TgkSpecificCompanysettings.updateOne(

                        { companyId : req.body.companyId},  
                        {
                            $push:{
                                bankDetails : {
                                    accHolderName : req.body.accHolderName,
                                    accNickName   : req.body.accNickName,
                                    bankName      : req.body.bankName,
                                    branchName    : req.body.branchName,
                                    accType       : req.body.accType,
                                    accNumber     : req.body.accNumber,
                                    ifscCode      : req.body.ifscCode,
                                }
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data.nModified == 1){
                            res.status(200).json("Company Bank Details added");
                        }else{
                            res.status(404).json("Company Bank Not found");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });  
                    break;
                default :
                    res.status(404).json('This Information is not captured yet.')
            };
            break;
        case 'remove' :
            switch(info){
                case 'location':
                    console.log('location remove ',req.body);
                    TgkSpecificCompanysettings.updateOne(
                                        { companyId : req.body.companyId},  
                                        {
                                            $pull:{
                                                companyLocationsInfo : {
                                                    _id  : req.body.locationID,
                                                }
                                            }
                                        }
                                    )
                                    .exec()
                                    .then(data=>{
                                        if(data.nModified == 1){
                                            res.status(200).json("Company Location removed");
                                        }else{
                                            res.status(404).json("Company Location Not found");
                                        }
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });  
                    break;
                case 'tax' :
                    console.log('tax remove ',req.body);
                    TgkSpecificCompanysettings.updateOne(
                                        { companyId : req.body.companyId},  
                                        {
                                            $pull:{
                                                taxSettings : {
                                                    _id        : req.body.taxID,
                                                }
                                            }
                                        }
                                    )
                                    .exec()
                                    .then(data=>{
                                        if(data.nModified == 1){
                                            res.status(200).json("Company Tax Settings removed");
                                        }else{
                                            res.status(404).json("Company Not found");
                                        }
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });  
                    break;
                case 'bank' :
                    console.log('bank remove ',req.body);
                    TgkSpecificCompanysettings.updateOne(
                                        { companyId : req.body.companyID},  
                                        {
                                            $pull:{
                                                bankDetails : {
                                                    _id        : req.body.bankID,
                                                }
                                            }
                                        }
                                    )
                                    .exec()
                                    .then(data=>{
                                        if(data.nModified == 1){
                                            res.status(200).json("Company Bank Details removed");
                                        }else{
                                            res.status(404).json("Company Not found");
                                        }
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });  
                    break;
                default :
                    res.status(404).json('This Information is not captured yet.')
            };
            break;
        case 'edit' :
            switch(info){
                case 'location':
                    console.log('location edit ',req.body);
                    TgkSpecificCompanysettings.updateOne(
                                        { "companyId" : req.body.companyId, "companyLocationsInfo._id":req.body.locationID},  
                                        {
                                            $set:{
                                                "companyLocationsInfo.$.location"        : req.body.Location,
                                                "companyLocationsInfo.$.contactnumber"   : req.body.contactnumber,
                                                "companyLocationsInfo.$.blockname"       : req.body.blockname,
                                                "companyLocationsInfo.$.landmark"        : req.body.landmark,
                                                "companyLocationsInfo.$.companyDistrict" : req.body.companyDistrict,
                                                "companyLocationsInfo.$.companyPincode"  : req.body.companyPincode,
                                                "companyLocationsInfo.$.companyCity"     : req.body.companyCity,
                                                "companyLocationsInfo.$.companyState"    : req.body.companyState,
                                                "companyLocationsInfo.$.companyCountry"  : req.body.companyCountry,
                                                "companyLocationsInfo.$.companytaluka"   : req.body.companytaluka,
                                                "companyLocationsInfo.$.areaName"        : req.body.areaName,
                                                "companyLocationsInfo.$.pincodesCovered" : req.body.pincodesCovered,
                                                "companyLocationsInfo.$.officeLocationid": req.body.companyCity+'-'+req.body.areaName+'-'+"Field-Office", 
                                                
                                            }
                                        }
                                    )
                                    .exec()
                                    .then(data=>{
                                        if(data.nModified == 1){
                                            res.status(200).json("Company Location updated");
                                        }else{
                                            res.status(404).json("Company Location Not found");
                                        }
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });  
                    break;
                case 'tax' :
                    console.log('tax edit ',req.body);
                    TgkSpecificCompanysettings.updateOne(
                                        { "companyId" : req.body.companyID, "taxSettings._id":req.body.taxID},  
                                        {
                                            $set:{
                                                "taxSettings.$.taxType"          : req.body.taxType,
                                                "taxSettings.$.taxRating"        : req.body.taxRating,
                                                "taxSettings.$.effectiveFrom"    : req.body.effectiveFrom,
                                                // "taxSettings.$.effectiveTo"      : req.body.effectiveTo
                                            }
                                        }
                                    )
                                    .exec()
                                    .then(data=>{
                                        if(data.nModified == 1){
                                            res.status(200).json("Company Tax updated");
                                        }else{
                                            res.status(404).json("Company Tax Not found");
                                        }
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });  
                    break;
                case 'bank' :
                    console.log('bank edit ',req.body);
                    TgkSpecificCompanysettings.updateOne(
                                        { "companyId" : req.body.companyID, "bankDetails._id":req.body.bankID},  
                                        {
                                            $set:{
                                                "bankDetails.$.accHolderName" : req.body.accHolderName,
                                                "bankDetails.$.bankName"      : req.body.bankName,
                                                "bankDetails.$.branchName"    : req.body.branchName,
                                                "bankDetails.$.accNumber"     : req.body.accNumber,
                                                "bankDetails.$.ifscCode"      : req.body.ifscCode,
                                            }
                                        }
                                    )
                                    .exec()
                                    .then(data=>{
                                        if(data.nModified == 1){
                                            res.status(200).json("Company Bank Details updated");
                                        }else{
                                            res.status(404).json("Company Bank Not found");
                                        }
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });  
                    break;
                default :
                    res.status(404).json('This Information is not captured yet.')
            };
        break;
        default :
            res.status(404).json('Action Not found');
            break;
    }
}

exports.delete_companysettings = (req,res,next)=>{
    TgkSpecificCompanysettings.deleteOne({_id:req.params.companysettingsID})
        .exec()
        .then(data=>{
            res.status(200).json("Company Settings deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.deleteall_user = function (req, res,next) {
    TgkSpecificCompanysettings.deleteMany({
       
    }, function (err) {
        if(err){
            return res.json({
                error: err
            });
        }
        res.json({
            status: "success",
            message: 'All Users deleted'
        });
    });
};


exports.update_companysettinginfo = (req,res,next)=>{
    // var roleData = req.body.role;
    TgkSpecificCompanysettings.updateOne(
        { companyId : req.body.companyId},    
            {
                $set:{
           
                    "companyName"            : req.body.companyName,
                    "companyContactNumber"   : req.body.companyContactNumber,
                    "companyMobileNumber"    : req.body.companyMobileNumber,
                    "companyEmail"           : req.body.companyEmail,
                    "companyAltEmail"        : req.body.companyAltEmail,
                    "companywebsite"         : req.body.companywebsite,
                    "companyaddress"         : req.body.companyaddress,
                    "city"                   : req.body.city, 
                    "country"                : req.body.country,
                    "state"                  : req.body.state,
                    "district"               : req.body.district,
                    "pincode"                : req.body.pincode,
                    "taluka"                 : req.body.taluka,
				
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){
				// console.log('data =========>>>',data);
                res.status(200).json("Company Setting Updated");
            }else{
                res.status(401).json("Company Setting Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}




