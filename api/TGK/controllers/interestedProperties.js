const mongoose	= require("mongoose");

const InterestedProps = require('../models/interestedProperties');
const Properties = require('../models/properties');
const ObjectId = require('mongodb').ObjectID;
const CompanySettings = require('../../coreAdmin/models/tgkspecific/tgkSpecificcompanysettings.js');
const Users             = require('../../coreAdmin/models/users');
function allocateTofieldAgent(propertyID){
    return new Promise(function(resolve,reject){
        Properties.findOne({"_id" : propertyID})
                  .exec()
                  .then(property=>{
                    if(property){
                        console.log("property _id",property.propertyLocation.pincode);
                        CompanySettings.findOne(
                                                {
                                                    "companyId"                             : 1,
                                                    "companyLocationsInfo.pincodesCovered"  : property.propertyLocation.pincode
                                                },
                                                {
                                                    "_id"                  : 0, 
                                                    "companyLocationsInfo" : {
                                                            $elemMatch: {"pincodesCovered" : property.propertyLocation.pincode}
                                                        }
                                                }
                                            )
                                        .exec()
                                        .then(csdata=>{

                                            console.log("csdata ",csdata);
                                            
                                            Users.find({"roles" : "Field Agent","officeLocation" : (csdata.companyLocationsInfo[0]._id) })
                                                 .sort({updateAt:1})
                                                 .exec()
                                                 .then(fieldAgents=>{
                                                    console.log("fieldAgents ",fieldAgents);
                                                    if(fieldAgents.length > 0){
                                                        //Sales agents found. Then find, to which SA, the last property was assigned
                                                        Users.updateOne(
                                                                    { "_id" : fieldAgents[0]._id},
                                                                    {
                                                                        $set : {
                                                                            "updateAt"              : new Date(),
                                                                            "profile.propertyCount" : fieldAgents[0].profile.propertyCount ? fieldAgents[0].profile.propertyCount + 1 : 1
                                                                        }
                                                                    }
                                                                )
                                                             .exec()
                                                             .then(data=>{
                                                                resolve(fieldAgents[0]._id)
                                                             })
                                                             .catch(err =>{
                                                                    console.log(err);
                                                                    reject(err);
                                                               });      
                                                    }else{
                                                        Users.findOne({"roles" : "Field Manager"})
                                                            .exec()
                                                            .then(fieldAgents=>{
                                                                console.log("fieldAgents---in field agent----->",fieldAgents[0]._id); 
                                                                if(fieldAgents.length > 0){
                                                                    
                                                                    resolve(fieldAgents[0]._id);
                                                                }else{
                                                                    console.log(err);
                                                                    reject("Field Manager not found.");
                                                                }
                                                                
                                                            })
                                                           .catch(err =>{
                                                                console.log(err);
                                                                reject(err);
                                                           });
                                                    }
                                                 })
                                                .catch(err =>{
                                                  console.log(err);
                                                    Users.findOne({"roles" : "Field Manager"})
                                                    .exec()
                                                    .then(fieldAgents=>{
                                                         console.log("fieldAgents---in manager----->",fieldAgents[0]._id); 
                                                        resolve(fieldAgents[0]._id);
                                                    })
                                                   .catch(err =>{
                                                        console.log(err);
                                                        reject(err);
                                                   });
                                                });
                                        })
                                        .catch(err =>{
                                                console.log(err);
                                                reject(err);
                                            });
                    }else{
                        reject({message:"Property Not Found"});
                    }
                  })
                  .catch(err =>{
                        console.log(err);
                        reject(err);
                    })
    });
};
exports.create_interestedProps = (req,res,next)=>{ 
    main();
    async function main(){
        var fieldAgent = await allocateTofieldAgent(req.body.property_id); 
        const interestedProps = new InterestedProps({
                _id                     : new mongoose.Types.ObjectId(),
                buyer_id                : req.body.buyer_id,
                property_id             : req.body.property_id,
                createdAt               : new Date(),
                fieldAgent              : [{
                                               agentID    :  fieldAgent,
                                               createdAt  : new Date(),
                                               status     : "Active",
                                               remark     : "New Interested Property"
                                           }],
                                           

        });

        interestedProps.save()
            .then(data=>{ 

            console.log("saved interest property----------->",data);       
                res.status(200).json({
                    "message" : 'Property Interest from this Buyer is Saved',
                });
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    message : "Some error in saving the Interested Buyer",
                    error: err
                });
            });
    		           
    }
};
exports.detail_interestedProps = (req, res, next)=>{
	var id = req.params.sellResidentsID;
	InterestedProps.findOne({_id:id})
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
// exports.list_myInterestedProps = (req,res,next)=>{
//     // console.log('list');
//     const buyer_id = req.params.user_id;
//     InterestedProps .find({"buyer_id" : buyer_id},{"property_id":1,"_id":0})
//                     .sort({"createdAt":-1})
//                     .exec()
//                     .then(property_ids=>{
//                         var propertyIds = property_ids.map((a)=>a.property_id)
//                         // console.log("property_ids",propertyIds)
//                         if(propertyIds){
//                             Properties
//                                 .find({_id : {$in:propertyIds}})
//                                 .exec()
//                                 .then(properties=>{
//                                     // console.log(properties)
//                                     res.status(200).json(properties);
//                                 })
//                                 .catch(err =>{
//                                     console.log(err);
//                                     res.status(500).json({
//                                         error: err
//                                     });
//                                 });

//                         }else{
//                             res.status(200).json({"message" : 'Interested Properties not found'});
//                         }
//                     })
//                     .catch(err =>{
//                         console.log(err);
//                         res.status(500).json({
//                             error: err
//                         });
//                     });
// }
exports.list_myInterestedProps = (req,res,next)=>{
    // console.log('list');
    const buyer_id = req.params.user_id;
    InterestedProps 
        .find({"buyer_id" : buyer_id},{"property_id":1,"_id":0})
        .sort({"createdAt":-1})
        .exec()
        .then(property_ids=>{
            var propertyIds = property_ids.map((a)=>a.property_id)
            // console.log("property_ids",propertyIds)
            if(propertyIds){
                Properties
                    .find({_id : {$in:propertyIds}})
                    .exec()
                    .then(properties=>{
                      if(properties){
                        for(var k=0; k<properties.length; k++){                    
                              properties[k] = {...properties[k]._doc, isInterested:false};
                          }

                        if(req.params.user_id){
                            InterestedProps  
                                .find({"buyer_id" : req.params.user_id})
                                .then(iprops => {
                                  // console.log("iprops",iprops);
                                    if(iprops.length > 0){
                                        for(var i=0; i<iprops.length; i++){
                                            for(let j=0; j<properties.length; j++){                                      
                                                if(String(iprops[i].property_id) === String(properties[j]._id)){
                                                    properties[j] = {...properties[j], isInterested:true};
                                                    break;
                                                }

                                            }

                                        }
                                        if(i >= iprops.length){
                                            res.status(200).json(properties);
                                        }       
                                        }else{
                                            res.status(200).json(properties);
                                        }
                                    })
                                    .catch(err =>{
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });                        
                            }else{

                                res.status(200).json(searchResults);
                            }
                      }else{
                          res.status(404).json('Properties not found');
                      }
                  })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });

            }else{
                res.status(200).json({"message" : 'Interested Properties not found'});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.delete_interestedProps = (req,res,next)=>{
    // console.log("uid=>",req.params.buyer_id,"property_id=>",req.params.property_id)
    InterestedProps.deleteOne({buyer_id:req.params.buyer_id,property_id:req.params.property_id})
        .exec()
        .then(data=>{
            // console.log("data",data);
            res.status(200).json("Interested Property deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};




