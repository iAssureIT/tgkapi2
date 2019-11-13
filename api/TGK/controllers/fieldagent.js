const mongoose	= require("mongoose");
const Properties        = require('../models/properties');
const Sellometers = require('../models/sellometers');
const MasterSellometers = require('../models/mastersellometer');
const Users             = require('../../coreAdmin/models/users');
const InterestedProps = require('../models/interestedProperties');
var ObjectID = require('mongodb').ObjectID;

// ---------------------------------API To get Field Agent List as per status----------------------------

exports.list_Properties_fieldAgent_type = (req,res,next)=>{
    console.log("list_Properties_fieldAgent_type ");
    Properties.find({
                            "fieldAgent.agentID" : ObjectID(req.params.fieldAgentID),
                            "status"                : req.params.status,
                    })
                .sort({"updatedAt":1})
                .exec()
                .then(data=>{
                    console.log("list_Properties_fieldAgent_type ",data);
                    if(data.length > 0){
                        var returnData = [];
                        var i = 0;
                        for(i = 0 ; i < data.length ; i++){
                            returnData.push({
                                                "interestedProperties_id" : data[i]._id,
                                                "property" : data[i]
                                            }); 
                        }
                        if( i >= data.length){
                            res.status(200).json(returnData);
                        }
                    }else{
                        res.status(200).json([]);
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
}

//---- API To get InterestedProperties which are allocated to Field Agent with Mentioned Outer Status------------

// exports.list_InterestedProperties_FieldAgent_OuterStatus = (req,res,next)=>{
//     console.log("list_InterestedProperties_FieldAgent_OuterStatus ",req.params);
//     InterestedProps.find({
//                                 "fieldAgent.agentID" : req.params.user_id,
//                                 "fieldAgent.status"  : "Active",
//                                 "status"             : req.params.status
//                     })
//                    .populate('property_id')
//                    .sort({updatedAt:1})
//                    .exec()
//                    .then(data=>{
//                         var k = 0 ;
//                         var returnData = [];
//                         for(k = 0 ; k < data.length ; k++){
//                             // data[k].property_id.interestedProperties_id = data[k]._id;
//                             returnData.push({
//                                                 "interestedProperties_id" : data[k]._id,
//                                                 "property" : data[k].property_id
//                                             })
//                             // if(data[k].property_id.interestedProperties_id){
//                             //     returnData.push(data[k].property_id);
//                             // }
//                         }
//                         if(k >= data.length){
//                             res.status(200).json(returnData);
//                         }
//                    })
//                    .catch(err =>{
//                         console.log(err);
//                         res.status(500).json({
//                             error: err
//                         });
//                     });
// };

exports.list_InterestedProperties_FieldAgent_OuterStatus = (req,res,next)=>{
    console.log("list_InterestedProperties_FieldAgent_OuterStatus ",req.params);
    InterestedProps.aggregate([
                                {
                                    $match : {
                                                "fieldAgent.agentID" : req.params.user_id,
                                                "fieldAgent.status"  : "Active",
                                                "status"             : req.params.status
                                            }
                                },
                                { 
                                    $project : { 
                                                  interestedProperties_id   : "$_id", 
                                                  // meeting_id                : { 
                                                  //                               $slice: [ "$meeting", -1 ] 
                                                  //                             } 
                                               } 
                                },
                                // {
                                //     $lookup : {
                                //                     from: "properties",
                                //                     localField: "property_id",
                                //                     foreignField: "_id",
                                //                     as: "property"            
                                //     }
                                // }
                             ])
                   // .populate('property_id')
                   .sort({updatedAt:1})
                   .exec()
                   .then(data=>{
                        res.status(200).json(data);
                   })
                   .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
};

//---- API To set new meeting request
exports.patch_setUpMeeting = (req,res,next)=>{
    console.log("patch_setUpMeeting ",req.body);
    InterestedProps.update(
                            { _id : req.body.interestedProperties_id},
                            {
                                $push : {
                                    meeting : {
                                        meetingDate        : req.body.meetingDate, //YYYY-MM-DD
                                        meetingTime        : req.body.meetingStartTime, //HH:MM AM 
                                        remark             : req.body.remark,
                                        meetingStatus      : "Scheduled", 
                                    }
                                },
                                $set : {
                                    status      : "meetingSet",
                                    updatedAt   : new Date()
                                }
                            }
                )
                .exec()
                .then(data=>{
                    if(data.nModified === 1){
                        res.status(200).json("Meeting Set")
                    }else{
                        res.status(200).json("Meeting Not Set")
                    }
                })
                .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
}

//---- API To update the status of the Meeting
exports.patch_updateMeeting = (req,res,next)=>{
    console.log("patch_updateMeeting ",req.body);
    InterestedProps.update(
                            { 
                                "_id"                     : req.body.interestedProperties_id,
                                "meeting.meetingStatus"   : { $elemMatch: { meetingStatus: { $ne: "Completed",$ne: "Cancelled" } } }
                                // $and : [{"meeting.meetingStatus" : {$ne : "Completed"}},{ "meeting.meetingStatus" : {$ne : "Cancelled"}}]

                            },
                            {
                                $set : {
                                    "meeting.$.meetingStatus"      : req.body.meetingStatus,
                                    "updatedAt"   : new Date() 
                                }
                            }
                )
                .exec()
                .then(data=>{
                    if(data.nModified === 1){
                        res.status(200).json("New Meeting Status Set")
                    }else{
                        res.status(200).json("Meeting Status Not Set")
                    }
                })
                .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
}
//---- API To update the Outer status
exports.patch_transaction_status_Update = (req,res,next)=>{
    switch(req.body.rootStatus){
        case 'TokenReceived' :
                InterestedProps.update(
                            { 
                                "_id"           : req.body.interestedProperties_id,
                            },
                            {
                                $set : {
                                    "status"                        : req.body.rootStatus, 
                                    "tokenReceived.tokenAmount"     : req.body.tokenAmount,
                                    "tokenReceived.tokenDate"       : req.body.tokenDate,
                                    "tokenReceived.tokenRemark"     : req.body.tokenRemark,
                                    "updatedAt"                     : new Date()
                                }
                            }
                )
                .exec()
                .then(data=>{
                    if(data.nModified === 1){
                        res.status(200).json("Outer Status Set")
                    }else{
                        res.status(200).json("Outer Status Not Set")
                    }
                })
                .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            break;
        case 'ContractDue'   :
                InterestedProps.update(
                                { 
                                    "_id"           : req.body.interestedProperties_id,
                                },
                                {
                                    $set : {
                                        "status"                    : req.body.rootStatus, 
                                        "contractDue.contractDate"  : req.body.contractDate,
                                        "contractDue.contactTime"   : req.body.contactTime,
                                        "contractDue.contractRemark": req.body.contractRemark,
                                    }
                                }
                    )
                    .exec()
                    .then(data=>{
                        if(data.nModified === 1){
                            res.status(200).json("Outer Status Set")
                        }else{
                            res.status(200).json("Outer Status Not Set")
                        }
                    })
                    .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
            break;
        default              :
                InterestedProps.update(
                                { 
                                    "_id"           : req.body.interestedProperties_id,
                                },
                                {
                                    $set : {
                                        "status"                    : req.body.rootStatus, 
                                        "updatedAt"                 : new Date()
                                    }
                                }
                    )
                    .exec()
                    .then(data=>{
                        if(data.nModified === 1){
                            res.status(200).json("Outer Status Set")
                        }else{
                            res.status(200).json("Outer Status Not Set")
                        }
                    })
                    .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
            break;
    }
    
}
