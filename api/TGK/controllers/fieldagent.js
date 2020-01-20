const mongoose	= require("mongoose");
const Properties        = require('../models/properties');
const Sellometers = require('../models/sellometers');
const MasterSellometers = require('../models/mastersellometer');
const Users             = require('../../coreAdmin/models/users');
const InterestedProps   = require('../models/interestedProperties');
// const Properties        = require('../models/properties')
var ObjectID = require('mongodb').ObjectID;

exports.count_properties = (req,res,next) =>{
    var query = "1";
    if(req.params.fieldAgentID === 'all'){
        query = {};
    }else{
        query = {
                    "fieldAgent.agentID" : ObjectID(req.params.fieldAgentID)
                };
    }
    if(query != "1"){
        console.log("query ",query);
        InterestedProps.find(query)
                       .exec()
                       .then(insProperties=>{
                            Properties.find(query)
                                      .exec()
                                      .then(properties=>{
                                            //New , MeetingSet ,Discarded, Shortlisted, TokenReceived, ContractDue, ContractCompleted, Delete
                                            res.status(200).json({
                                                "newSACount"              : properties.filter((data)=>{return data.status === "VerifyPending"}).length,
                                                "newClientCount"          : insProperties.filter((data)=>{return data.status === "New"}).length,
                                                // "newSACount"              : insProperties.filter((data)=>{return data.status === "New"}).length,
                                                "meetingCount"            : insProperties.filter((data)=>{return data.status === "meetingSet"}).length,
                                                "shownCount"              : insProperties.filter((data)=>{return data.status === "Shown"}).length,
                                                "shortlistedCount"        : insProperties.filter((data)=>{return data.status === "Shortlisted"}).length,
                                                "tokenReceivedCount"      : insProperties.filter((data)=>{return data.status === "TokenReceived"}).length,
                                                "contractDueCount"        : insProperties.filter((data)=>{return data.status === "ContractDue"}).length,
                                                "contractCompletedCount"  : insProperties.filter((data)=>{return data.status === "ContractCompleted"}).length,
                                                "deletedCount"            : insProperties.filter((data)=>{return data.status === "Delete"}).length, 
                                                "discardedCount"          : insProperties.filter((data)=>{return data.status === "Discarded"}).length,
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
};
// ---------------------------------API To get Field Agent List as per status----------------------------

exports.list_Properties_fieldAgent_type = (req,res,next)=>{
    console.log("list_Properties_fieldAgent_type ",req.params);
    var query = "1";
    if(req.params.fieldAgentID === 'all'){
        query = {
                    // "fieldAgent.agentID" : ObjectID(req.params.fieldAgentID),
                    "status"                : req.params.status,
                };
    }else{
        query = {
                    "fieldAgent.agentID" : ObjectID(req.params.fieldAgentID),
                    "status"                : req.params.status,
                };
    }
    if(query != "1"){
        console.log("list_Properties_fieldAgent_type query ",query);
        Properties.find(query)
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
}

//---- API To get InterestedProperties which are allocated to Field Agent with Mentioned Outer Status------------

exports.list_InterestedProperties_FieldAgent_OuterStatus = (req,res,next)=>{
    console.log("list_InterestedProperties_FieldAgent_OuterStatus ",req.params);
    var query = "1";
    if(req.params.user_id === 'all'){
        query = {
                    "fieldAgent.status"  : "Active",
                    "status"             : req.params.status
                };
    }else{
        query = {
                    "fieldAgent.agentID" : req.params.user_id,
                    "fieldAgent.status"  : "Active",
                    "status"             : req.params.status
                };
    }
    if(query != "1"){
        InterestedProps.find(query)
                       .populate('property_id')
                       .populate('buyer_id')
                       .sort({updatedAt:1})
                       .exec()
                       .then(data=>{
                        console.log("fieldAgent InterestedProps data===> ",data);
                            var k = 0 ;
                            var returnData = [];
                            for(k = 0 ; k < data.length ; k++){
                                // data[k].property_id.interestedProperties_id = data[k]._id;
                                returnData.push({
                                                    "interestedProperties_id" : data[k]._id,
                                                    "buyer_id"                : data[k].buyer_id._id,
                                                    "buyer_Name"              : data[k].buyer_id.profile.fullName,
                                                    "buyer_email"             : data[k].buyer_id.profile.emailId,
                                                    "buyer_Mobile"            : data[k].buyer_id.profile.mobileNumber,
                                                    "createdAt"               : data[k].createdAt,
                                                    "meeting_id"              : data[k].meeting && data[k].meeting.length > 0 ? data[k].meeting[data[k].meeting.length -1]._id : "",
                                                    "property"                : data[k].property_id
                                                })
                                // if(data[k].property_id.interestedProperties_id){
                                //     returnData.push(data[k].property_id);
                                // }
                            }
                            if(k >= data.length){
                                res.status(200).json(returnData);
                            }
                       })
                       .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
    }
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
                                "meeting._id"             : req.body.meeting_id,
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
                        if(req.body.meetingStatus === 'Completed'){
                            InterestedProps.update(
                                                        { 
                                                            "_id"           : req.body.interestedProperties_id,
                                                        },
                                                        {
                                                            $set : {
                                                                "status"                    : "Shown", 
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
                        }else{
                            res.status(200).json("New Meeting Status Set")
                        }
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
    switch(req.body.status){
        case 'TokenReceived' :
                InterestedProps.update(
                            { 
                                "_id"           : req.body.interestedProperties_id,
                            },
                            {
                                $set : {
                                    "status"                        : req.body.status, 
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
                                        "status"                        : req.body.status, 
                                        "contractDue.contractDate"      : req.body.contractDate,
                                        "contractDue.contactTime"       : req.body.contactTime,
                                        "contractDue.contractRemark"    : req.body.contractRemark,
                                        "contractDue.contractEndDate"   : req.body.contractEndDate,
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
                                        "status"                    : req.body.status, 
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
};

exports.fa_manager_dashboard_query_sa = (req,res,next)=>{
    Users.aggregate([
            { 
                $match :  
                { 
                    "$or":[
                        {"profile.manager_id": ObjectID(req.params.fieldAgentID)},
                        {"_id": ObjectID(req.params.fieldAgentID)}
                    ]
                } 
            },
            { 
                $lookup : {
                            "from"          : "properties",
                            "localField"    : "_id",
                            "foreignField"  : "fieldAgent.agentID",
                            "as"            : "userData"
                        }
            },
            {
                $unwind : "$userData" 
            },
            {
                $project: 
                    {
                        createdAtArray: {
                            $slice: [ "$userData.statusArray", -1 ] 
                          },
                        status:"$userData.status"   
                    } 
            },
            {"$unwind":"$createdAtArray"},
            { "$addFields": { createdAt     : '$createdAtArray.createdAt'} },
            {
                $project: 
                    {
                        
                        dateDifference: 
                            {
                                "$divide": [{ $subtract: [ new Date(), "$createdAt" ] }, 60 * 60 * 1000 ]
                            }, 
                        status:"$status"   
                    } 
            },

        ])
        .exec()
        .then(count=>{
            var propertiesCount = [
                    {
                        status      : "VerifyPending",
                        countObj    : {
                                            ls2    : 0,
                                            gr2ls4 : 0,
                                            gt4    : 0,

                                        }
                    }
             ];
             for(i=0;i<count.length;i++){
                for(j=0;j<propertiesCount.length;j++){
                    if(count[i].dateDifference <= 2 && count[i].status === propertiesCount[j].status ){
                       propertiesCount[j].countObj.ls2+=1;
                    }else if(count[i].dateDifference > 2 && count[i].dateDifference <=4 && count[i].status === propertiesCount[j].status){
                       propertiesCount[j].countObj.gr2ls4+=1;
                    }else if(count[i].dateDifference > 4 && count[i].status === propertiesCount[j].status){
                       propertiesCount[j].countObj.gt4+=1;
                    }
                }
             }
             
            res.status(200).json(propertiesCount);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.fa_manager_dashboard_query_client = (req,res,next)=>{
    Users.aggregate([
            { 
                $match :  
                { 
                    "$or":[
                        {"profile.manager_id": ObjectID(req.params.fieldAgentID)},
                        {"_id": ObjectID(req.params.fieldAgentID)}
                    ]
                } 
            },
            { 
                $lookup : {
                            "from"          : "interestedprops",
                            "localField"    : "_id",
                            "foreignField"  : "fieldAgent.agentID",
                            "as"            : "userData"
                        }
            },
            {
                $unwind : "$userData" 
            },
            {
                $project: 
                    {
                        createdAtArray: {
                            $slice: [ "$userData.fieldAgent", -1 ] 
                          },
                        status:"$userData.status"   
                    } 
            },
            {"$unwind":"$createdAtArray"},
            { "$addFields": { createdAt     : '$createdAtArray.createdAt'} },
            {
                $project: 
                    {
                        
                        dateDifference: 
                            {
                                "$divide": [{ $subtract: [ new Date(), "$createdAt" ] }, 60 * 60 * 1000 ]
                            }, 
                        status:"$status"   
                    } 
            },

        ])
        .exec()
        .then(count=>{
            var propertiesCount = [
                    {
                        status      : "New",
                        countObj    : {
                                            ls2    : 0,
                                            gr2ls4 : 0,
                                            gt4    : 0,

                                        }
                    },
                    {
                        status      : "meetingSet",
                        countObj    : {
                                            ls2    : 0,
                                            gr2ls4 : 0,
                                            gt4    : 0,

                                        }
                    },
                    {
                        status      : "Shown",
                        countObj    : {
                                            ls2    : 0,
                                            gr2ls4 : 0,
                                            gt4    : 0,

                                        }
                    },
                    {
                        status      : "Shortlisted",
                        countObj    : {
                                            ls2    : 0,
                                            gr2ls4 : 0,
                                            gt4    : 0,

                                        }
                    },
                    {
                        status      : "TokenReceived",
                        countObj    : {
                                            ls2    : 0,
                                            gr2ls4 : 0,
                                            gt4    : 0,

                                        }
                    },
                    {
                        status      : "ContractDue",
                        countObj    : {
                                            ls2    : 0,
                                            gr2ls4 : 0,
                                            gt4    : 0,

                                        }
                    },
                    {
                        status      : "Discarded",
                        countObj    : {
                                            ls2    : 0,
                                            gr2ls4 : 0,
                                            gt4    : 0,

                                        }
                    }
             ];
             for(i=0;i<count.length;i++){
                for(j=0;j<propertiesCount.length;j++){
                    if(count[i].dateDifference <= 2 && count[i].status === propertiesCount[j].status ){
                       propertiesCount[j].countObj.ls2+=1;
                    }else if(count[i].dateDifference > 2 && count[i].dateDifference <=4 && count[i].status === propertiesCount[j].status){
                       propertiesCount[j].countObj.gr2ls4+=1;
                    }else if(count[i].dateDifference > 4 && count[i].status === propertiesCount[j].status){
                       propertiesCount[j].countObj.gt4+=1;
                    }
                }
             }
             
            res.status(200).json(propertiesCount);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.fa_manager_tracking_dashboard= (req,res,next)=>{
    Users.aggregate([
            { 
                $match :  
                { 
                    "$or":[
                        {"profile.manager_id": ObjectID(req.params.fieldAgentID)},
                        {"_id": ObjectID(req.params.fieldAgentID)}
                    ]
                } 
            },
            { 
                $lookup : {
                            "from"          : "interestedprops",
                            "localField"    : "_id",
                            "foreignField"  : "fieldAgent.agentID",
                            "as"            : "userData1"
                        }
            },
            { 
                $lookup : {
                            "from"          : "properties",
                            "localField"    : "_id",
                            "foreignField"  : "fieldAgent.agentID",
                            "as"            : "userData2"
                        }
            },
            {
                $project: 
                    {
                        salesAgnetName: "$profile.fullName",
                        status        : "$userData1.status",   
                        status1       : "$userData2.status"   
                    } 
            },
        ])
        .exec()
        .then(count=>{
            console.log("count1123",count);

            var fieldAgents = [];
            var i =0;
             for(i=0;i<count.length;i++){
                var j=0;
                var k=0;
                var fieldAgent = {
                        _id                : count[i]._id,
                        fieldAgnetName     : count[i].salesAgnetName,
                        verifyPendingCount : 0,
                        assignedCount      : 0,
                        meetingSetCount    : 0,
                        shownCount         : 0,
                        shortlistedCount   : 0,
                        tokenReceivedCount : 0,
                        contractDueCount   : 0,
                        discardedCount     : 0,
                    }
                for (j=0;j<count[i].status.length;j++) {
                    if(count[i].status[j]=== "New"){
                        fieldAgent.assignedCount+=1;
                    }else if(count[i].status[j]=== "meetingSet"){
                        fieldAgent.meetingSetCount+=1;
                    }else if(count[i].status[j]=== "Shown"){
                        fieldAgent.shownCount+=1;
                    }else if(count[i].status[j]=== "Shortlisted"){
                        fieldAgent.shortlistedCount+=1;
                    }else if(count[i].status[j]=== "TokenReceived"){
                        fieldAgent.tokenReceivedCount+=1;
                    }else if(count[i].status[j]=== "ContractDue"){
                        fieldAgent.contractDueCount+=1;
                    }else if(count[i].status[j]=== "Discarded"){
                        fieldAgent.discardedCount+=1;
                    }
                }
                for (K=0;K<count[i].status1.length;K++) {
                    if(count[i].status1[K]=== "VerifyPending"){
                        fieldAgent.verifyPendingCount+=1;
                    }
                }
                    fieldAgents.push(fieldAgent);
             }
             console.log("fieldAgents",fieldAgents);
             if(i === count.length){
                res.status(200).json(fieldAgents);
             }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


