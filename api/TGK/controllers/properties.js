const mongoose	= require("mongoose");

const Properties        = require('../models/properties');
const Sellometers = require('../models/sellometers');
const MasterSellometers = require('../models/mastersellometer');
const Users             = require('../../coreAdmin/models/users');


// ===================== round robin ================
exports.create_Properties = (req,res,next)=>{
    main();

    async function main(){
        var allocatedToUserId = await getAllocatedToUserID(); 
        console.log("allocatedToUserId = ",allocatedToUserId);
        Properties.find()
                  .exec()
                  .then(data =>{
                          var propertyCode = data.length + 101;
                          const properties = new Properties({
                                  _id                     : new mongoose.Types.ObjectId(),
                                  owner_id                : req.body.uid,
                                  propertyCode            : propertyCode,
                                  propertyHolder          : req.body.propertyHolder,
                                  transactionType         : req.body.transactionType,
                                  propertyType            : req.body.propertyType,
                                  propertySubType         : req.body.propertySubType,                 
                                  floor                   : req.body.floor,
                                  totalFloor              : req.body.totalFloor,
                                  status                  : req.body.status,
                                  listing                 : false,           
                                  $push:{                            
                                        "statusArray"     : {
                                                                "statusVal"   : req.body.status, 
                                                                "createdAt"   : new Date(),
                                                                // "allocatedTo" : allocatedToUserId,
                                                            },                
                                  }
                              });
                          properties.save()
                                          .then(data=>{                                            
                                              res.status(200).json({
                                              "message"        : 'Property Added',
                                              "propertyCode"   : data.propertyCode,
                                              "property_id"    : data._id
                                              });
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
    }


     function getAllocatedToUserID(){
        return new Promise(function(resolve,reject){
            Users.find({"roles" : "sales agent"},{$sort:{createdAt:1}})
                 .exec()
                 .then(salesAgents=>{
                    if(salesAgents.length > 0){
                        //Sales agents found. Then find, to which SA, the last property was assigned
                        Properties.find({})
                                  .sort({createdAt:-1})
                                  .limit(1)
                                  .exec()
                                  .then(oneProperty=>{
                                      if(oneProperty.length > 0){
                                        resolve(oneProperty.statusArray[0].allocatedToUserId);
                                      }else{
                                        resolve(salesAgents[0]);
                                      }
                                  })
                                  .catch(err =>{
                                    res.status(500).json({
                                        message : "Properties Not Found",
                                        error: err
                                    });
                                });
                    }else{
                        Users.findOne({"roles" : "Technical Admin"})
                        .exec()
                        .then(admin=>{
                            resolve(admin._id);
                        })
                       .catch(err =>{
                        res.status(500).json({
                            message : "Admin role user Not Found",
                            error: err
                           });
                       });
                    }
                 })
                .catch(err =>{
                    Users.findOne({"roles" : "Technical Admin"})
                    .exec()
                    .then(admin=>{
                        resolve(admin._id);
                    })
                   .catch(err =>{
                    res.status(500).json({
                        message : "Admin role user Not Found",
                        error: err
                       });
                   });
                });
        });
    }

};

// exports.create_Properties = (req,res,next)=>{
    
//         Properties.find()
//                   .exec()
//                   .then(data =>{
//                           var propertyCode = data.length + 101;
//                           const properties = new Properties({
//                                   _id                     : new mongoose.Types.ObjectId(),
//                                   owner_id                : req.body.uid,
//                                   propertyCode            : propertyCode,
//                                   propertyHolder          : req.body.propertyHolder,
//                                   transactionType         : req.body.transactionType,
//                                   propertyType            : req.body.propertyType,
//                                   propertySubType         : req.body.propertySubType,                 
//                                   floor                   : req.body.floor,
//                                   totalFloor              : req.body.totalFloor,
//                                   status                  : req.body.status,
//                                   listing                 : false,           
//                                   $push:{                            
//                                         "statusArray"     : {
//                                                                 "statusVal"   : req.body.status, 
//                                                                 "createdAt"   : new Date(),
//                                                                 // "allocatedTo" : allocatedToUserId,
//                                                             },                
//                                   }

//                               });
//                           properties.save()
//                                           .then(data=>{                                            
//                                               res.status(200).json({
//                                               "message"        : 'Property Added',
//                                               "propertyCode"   : data.propertyCode,
//                                               "property_id"    : data._id
//                                               });
//                                           })
//                                           .catch(err =>{
//                                               console.log(err);
//                                               res.status(500).json({
//                                                   error: err
//                                               });
//                                           });
//                       })
//                       .catch(err =>{
//                           console.log(err);
//                           res.status(500).json({
//                               error: err
//                           });
//                       });
    


// };
exports.update_PropertyLocation = (req,res,next)=>{
    // var roleData = req.body.role;
    Properties.updateOne(
        { "_id" : req.body.property_id },                        
        {
            $set:{
                propertyLocation        : 
                                        {
                                            "address"             : req.body.address,
                                            "society"             : req.body.society,
                                            "subArea"             : req.body.subArea,
                                            "area"                : req.body.area,
                                            "landmark"            : req.body.landmark,
                                            "city"                : req.body.city,
                                            "block"               : req.body.block,
                                            "district"            : req.body.district,
                                            "state"               : req.body.state,
                                            "country"             : req.body.country,
                                            "pincode"             : req.body.pincode,

                                        },
                 index                   : req.body.index,
            }

        }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){
				
                res.status(200).json("property Location Updated");
            }else{
                res.status(401).json("property Location Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

//////////////////


exports.find_PropertyIndexPer = (req,res,next)=>{
    // var roleData = req.body.role;
    Sellometers.findOne({index : req.body.index})
        .exec()
        .then(data=>{
              if(data){
                console.log('data of sellometer',data.propertyClass);
                      MasterSellometers.findOne({class : data.propertyClass})
                      .exec()
                      .then(data1=>{
                        console.log('data of master sellometer ',data1);
                       
                          if(res.status(200))
                          {
                            res.status(200).json({
                              data: data1
                             });
                          }else{
                             res.status(200).json({
                              data: {
                                "earnings" : 30,
                              }
                             });
                          }
                        // elese default value

                    })
                    .catch(err =>{
                      console.log(err);
                      res.status(500).json({
                       error: err
                      });
                    });
                    }else{

                          console.log("earnings====>");
                           res.status(200).json({
                            data: {
                              "earnings" : 30,
                            }
                           });
                  }
        })
        .catch(err =>{
            res.status(500).json({
               error: err
            });
        });
}

//////////////////


exports.update_PropertyDetails = (req,res,next)=>{
    // var roleData = req.body.role;
    Properties.updateOne(
        { "_id" : req.body.property_id },                        
        {
            $set:{
                propertyDetails         :   {
                                                "furnishedStatus"     :  req.body.furnishedStatus,
                                                "bedrooms"            :  req.body.bedrooms,
                                                "balconies"           :  req.body.balconies,
                                                "bathrooms"           :  req.body.bathrooms,
                                                "washrooms"           :  req.body.washrooms,
                                                "personal"            :  req.body.personal,
                                                "pantry"              :  req.body.pantry,
                                                "ageofProperty"       :  req.body.ageofProperty,
                                                "facing"              :  req.body.facing,                                                            
                                                "superArea"           :  req.body.superArea,
                                                "builtupArea"         :  req.body.builtupArea,
                                              
                                               
                                                
                                            },
            }
        }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){
				
                res.status(200).json("Property Details Updated");
            }else{
                res.status(401).json("Property Details Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_amenities = (req,res,next)=>{
    // var roleData = req.body.role;
    Properties.updateOne(
        { "_id" : req.body.property_id },                        
        {
            $set:{
                    "Amenities"    : req.body.Amenities,
            }
        }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){
				
                res.status(200).json("Amenities Updated");
            }else{
                res.status(401).json("Amenities Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_financials = (req,res,next)=>{
    // var roleData = req.body.role;
    Properties.updateOne(
        { "_id" : req.body.property_id },                        
        {
            $set:{
                financial               :   {
                    "expectedRate"        : req.body.expectedRate,
                    "totalPrice"          : req.body.totalPrice,
                    "includeCharges"      : req.body.includeCharges,
                    "maintenanceCharges"  : req.body.maintenanceCharges,
                    "maintenancePer"      : req.body.maintenancePer,        
                    "description"         : req.body.description,     
                    "availableFrom"       : req.body.availableFrom,
                    "depositAmount"       : req.body.depositAmount,       
                    "monthlyRent"         : req.body.monthlyRent,
                    
                },
            }
        }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){				
                res.status(200).json("Financial Updated");
            }else{
                res.status(401).json("Financial Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_availabilityPlan = (req,res,next)=>{
    // var roleData = req.body.role;
    Users.find({"roles" : "salesAgent" })
         .select("_id")
         .exec()
         .then(toUser_id => {
             console.log("toUser_id = ",toUser_id);
            Properties.updateOne(
                { "_id" : req.body.property_id },                        
                {
                    $set:{
                        "avalibilityPlanVisit" : {
                                            "contactPerson"         : req.body.contactPerson,
                                            "contactPersonMobile"   : req.body.contactPersonMobile,
                                            "available"             : req.body.available,
                                    
                                        },
                      
        
                        "propertyCreatedAt" : new Date(),
                    }
                }
                )
                .exec()
                .then(data=>{
                    console.log('data ',data);
                    if(data.nModified == 1){                        
                        res.status(200).json("Avalibility Plan Visit Updated");
                    }else{
                        res.status(401).json("Avalibility Plan Visit Not Found");
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
         })
         .catch(err => {
            console.log(err);
            res.status(500).json({
                message : "SalesAgent Role Users Not Found. You must have one Sales Agent Role User",
                error   : err
            });
        });


}

exports.update_photosandvideos = (req,res,next)=>{
    console.log("input = ",req.body);
    
    Properties.findOne({"_id":req.body.property_id})
              .exec()
              .then( targetProperty =>{
                    Properties.updateOne(
                        { "_id" : req.body.property_id },
                        {
                            $set:{
                                "gallery.Images" : req.body.propertyImages,
                                "gallery.video"  : req.body.video,
                                "status"         : req.body.status, 
                            },
                            
                            $push:{                            
                                "statusArray" :  {
                                                "statusVal"   : req.body.status, 
                                                "createdAt"   : new Date(),
                                                "allocatedTo" : targetProperty.status[0].allocatedTo,
                                            },                
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data.nModified == 1){				
                            res.status(200).json("Images and Video Updated");
                        }else{
                            res.status(401).json("Images and Video are Not Found");
                        }
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

},

exports.detail_Properties = (req, res, next)=>{
	var id = req.params.propertyID;
	Properties.findOne({_id:id})
		// .select("profile")
		.exec()
		.then(data =>{
			res.status(200).json(data);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
}

exports.list_Properties = (req,res,next)=>{
    console.log('list');
    Properties.find({})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Properties Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.property_list = (req,res,next)=>{
    console.log('list of property ');
    Properties.find({propertyType:req.params.propertyType , transactionType: req.params.transactionType ,}).skip(req.body.startRange).limit(req.body.limitRange)
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Property Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.my_property_list = (req,res,next)=>{
    console.log('list of My property ');
    Properties.find({ owner_id : req.params.uid,})
    // Properties.find({propertyId:req.params.property_id , transactionType: req.params.transactionType ,})

        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);

            }else{
                res.status(404).json('Property Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_Properties = (req,res,next)=>{
    Properties.deleteOne({_id:req.params.propertyID})
        .exec()
        .then(data=>{
            res.status(200).json("Properties deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.deleteall_Properties = (req,res,next)=>{
    Properties.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All Properties deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
        
//----------------Rushikesh----------------------
exports.update_approvedlist = (req,res,next)=>{
    console.log("input = ",req.body);
    Properties.updateOne(
        { "_id" : req.body.property_id },
        {
            $push:{
                    "statusArray" : [{
                                "statusVal"             : req.body.status, 
                                "createdBy"             : req.body.user_id, 
                                "createdAt"             : new Date(),
                                "allocatedTo"           : req.body.allocatedToUserId,
                                "remark"                : req.body.remark,  
                            }],
                },
            $set:{
                "status" : req.body.status,
            }   
        }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){                
                res.status(200).json("Status Updated");
            }else{
                res.status(401).json("Status Not Updated");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


exports.property_displaylist = (req,res,next)=>{
    console.log("input = ",req.body);
    Properties.find(
            {
                statusArray: {
                    $elemMatch: {
                        allocatedTo : req.body.user_id, statusVal : req.body.status
                    }
                },
                status:req.body.status
            }
        )
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Properties Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }