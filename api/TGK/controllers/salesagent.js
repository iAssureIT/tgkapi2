
const mongoose	= require("mongoose");
var moment              = require('moment');

const Properties        = require('../models/properties');
const Users             = require('../../coreAdmin/models/users');
var ObjectId = require('mongodb').ObjectID;


////////////////////////////SA API////////////////////////////

exports.property_sa_displaylist = (req,res,next)=>{
    Properties.find(
            {
                status              : req.body.status,
                // createdAt           : {$gt : moment(new Date()).formate("YYYY-MM-DD")}
            }
        )
        .sort({"propertyCreatedAt" : 1})
        .exec()
        .then(property=>{
            if(property){

                // code to calculate form fill percentage-------------
                // var propertyData = property;
                // var propertyData1;
                // var propertyData2=[];
                // var count = 0;
                // var Tcount = 0;
                // propertyData1 = propertyData[0];
                // propertyData1 = JSON.stringify(propertyData1, replaceUndefinedOrNull());
                // propertyData1 = JSON.parse(propertyData1);
                // async function replaceUndefinedOrNull(key, value) {                       
                //     Tcount = Tcount + 1;
                //     property[0].Tcount = Tcount;
                //      // console.log("Tcount--->",Tcount);
                //       if (value === ""){
                //            count = count+1;
                //             // console.log("count--->",count);
                //             property[0].setCount = count;
                //             var formFillPercentage = ((Tcount-count)/Tcount) * 100;
                //             property[0].formFillPercentage = (formFillPercentage).toFixed(2);  
                //             return count;
                //       }
                //       return value;
                // } 

                
                for (var i = property.length - 1; i >= 0; i--) {
                    Users.find({"_id":property[i].owner_id})
                    .exec()
                    .then(user=>{
                        // console.log("user",user);
                        if(user){
                            var propertyObj ={
                                userName : user[0].profile.fullName,
                                mobNumber: user[0].mobileNumber,
                                emailId  : user[0].profile.emailId
                            }
                            if(propertyObj && propertyObj.mobileNumber){
                                property[i].push(propertyObj);
                            }
                        }else{
                            res.status(404).json('user not found');
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    }); 
                }
                if(i<0){
                   // console.log("newData---------->",property);
                  res.status(200).json(property);

                }   
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

//----------------Rushikesh----------------------
exports.update_approvedlist = (req,res,next)=>{
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
                "listing"  : req.body.listing,
                "status" : req.body.status,
                "updateAt" : new Date(), 
            }   
        }
        )
        .exec()
        .then(data=>{
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


exports.property_sa_totaldisplaylist = (req,res,next)=>{
    // console.log("in count------------------",req.params);
    var todayDate = moment(new Date()).format("YYYY-MM-DD");
    if(req.params.userRole=="admin" || req.params.userRole=="Sales Manager"){
        console.log("admin");
        Properties.find()        
        .exec()
        .then(property=>{
            // console.log("admin property",property);
            if(property){
                var WIPData = property.filter((WIPdata)=>{return WIPdata.status==="WIP"});
                var NEWData = property.filter((WIPdata)=>{return WIPdata.status==="New"});
                var RELISTINGData = property.filter((WIPdata)=>{return WIPdata.status==="ReListing"});
                var VERIFIEDData = property.filter((WIPdata)=>{return WIPdata.status==="Verified"});
                var VERIFYPENDINGData = property.filter((WIPdata)=>{return WIPdata.status==="VerifyPending"});
                var LISTEDData  = property.filter((WIPdata)=>{return WIPdata.status==="Listed"});

                var WIPCount = WIPData.length;
                var NEWCount = NEWData.length;
                var RELISTINGCount = RELISTINGData.length;
                var VERIFIEDCount = VERIFIEDData.length;
                var LISTEDCount = LISTEDData.length;
                var VERIFYPENDINGCount = VERIFYPENDINGData.length;

                // if(i<0){
                  res.status(200).json({"WIPCount":WIPCount,"NEWCount":NEWCount,"RELISTINGCount":RELISTINGCount,"VERIFIEDCount":VERIFIEDCount,"LISTEDCount":LISTEDCount,"VERIFYPENDINGCount":VERIFYPENDINGCount});
                // }   
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
    }else if(req.params.userRole=="Sales Agent"){
        console.log("admin");
        Properties.find({
                        "salesAgent.agentID" : req.params.salesAgentID,
                        "salesAgent.status"  : "Active",
                        // "createdAtStr"       : {$ne : todayDate}
                    })        
        .exec()
        .then(property=>{
            // console.log("sales agent property",property);
            if(property){
                Properties.find({
                        "salesAgent.agentID" : req.params.salesAgentID,
                        "salesAgent.status"  : "Active",
                        "createdAtStr"       : {$ne : todayDate}
                    })        
                .exec()
                .then(propertyWIP=>{
                    var WIPData = propertyWIP.filter((WIPdata)=>{return WIPdata.status==="WIP"});
                    var NEWData = property.filter((WIPdata)=>{return WIPdata.status==="New"});
                    var RELISTINGData = property.filter((WIPdata)=>{return WIPdata.status==="ReListing"});
                    var VERIFIEDData = property.filter((WIPdata)=>{return WIPdata.status==="Verified"});
                    var VERIFYPENDINGData = property.filter((WIPdata)=>{return WIPdata.status==="VerifyPending"});
                    var LISTEDData  = property.filter((WIPdata)=>{return WIPdata.status==="Listed"});

                    var WIPCount = WIPData.length;
                    var NEWCount = NEWData.length;
                    var RELISTINGCount = RELISTINGData.length;
                    var VERIFIEDCount = VERIFIEDData.length;
                    var LISTEDCount = LISTEDData.length;
                    var VERIFYPENDINGCount = VERIFYPENDINGData.length;
                    // if(i<0){
                      res.status(200).json({"WIPCount":WIPCount,"NEWCount":NEWCount,"RELISTINGCount":RELISTINGCount,"VERIFIEDCount":VERIFIEDCount,"LISTEDCount":LISTEDCount,"VERIFYPENDINGCount":VERIFYPENDINGCount});
                // }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
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
    }else if(req.params.userRole=="Field Agent"){
        Properties.find({
                            "fieldAgent.agentID" : req.params.salesAgentID,
                            "fieldAgent.status"  : "Active",
                        })        
            .exec()
            .then(property=>{
                if(property){
                    var WIPData = property.filter((WIPdata)=>{return WIPdata.status==="WIP"});
                    var NEWData = property.filter((WIPdata)=>{return WIPdata.status==="New"});
                    var RELISTINGData = property.filter((WIPdata)=>{return WIPdata.status==="ReListing"});
                    var VERIFIEDData = property.filter((WIPdata)=>{return WIPdata.status==="Verified"});
                    var LISTEDData  = property.filter((WIPdata)=>{return WIPdata.status==="Listed"});
                    var VERIFYPENDINGData = property.filter((WIPdata)=>{return WIPdata.status==="VerifyPending"});

                    var WIPCount = WIPData.length;
                    var NEWCount = NEWData.length;
                    var RELISTINGCount = RELISTINGData.length;
                    var VERIFIEDCount = VERIFIEDData.length;
                    var LISTEDCount = LISTEDData.length;
                    var VERIFYPENDINGCount = VERIFYPENDINGData.length;

                    // if(i<0){
                      res.status(200).json({"WIPCount":WIPCount,"NEWCount":NEWCount,"RELISTINGCount":RELISTINGCount,"VERIFIEDCount":VERIFIEDCount,"LISTEDCount":LISTEDCount,"VERIFYPENDINGCount":VERIFYPENDINGCount});
                    // }   
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
};


exports.sa_manager_dashboard = (req,res,next)=>{
    Users.aggregate([
            { 
                $match :  
                { 
                   "$or":[
                        {"profile.manager_id": ObjectId(req.params.salesAgentID)},
                        {"_id": ObjectId(req.params.salesAgentID)}
                    ]
                } 
            },
            { 
                $lookup : {
                            "from"          : "properties",
                            "localField"    : "_id",
                            "foreignField"  : "salesAgent.agentID",
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
            console.log("count",count)
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
                        status      : "VerifyPending",
                        countObj    : {
                                            ls2    : 0,
                                            gr2ls4 : 0,
                                            gt4    : 0,

                                        }
                    },
                    {
                        status      : "Verified",
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


exports.sa_manager_tracking_dashboard= (req,res,next)=>{
    Users.aggregate([
            { 
                $match :  
                { 
                    "$or":[
                        {"profile.manager_id": ObjectId(req.params.salesAgentID)},
                        {"_id": ObjectId(req.params.salesAgentID)}
                    ]
                } 
            },
            { 
                $lookup : {
                            "from"          : "properties",
                            "localField"    : "_id",
                            "foreignField"  : "salesAgent.agentID",
                            "as"            : "userData"
                        }
            },
            {
                $project: 
                    {
                        salesAgnetName: "$profile.fullName",
                        status        : "$userData.status"   
                    } 
            },
        ])
        .exec()
        .then(count=>{
            var salesAgentCount = [];
             for(i=0;i<count.length;i++){
                var salesAgent = {
                        _id                : count[i]._id,
                        salesAgnetName     : count[i].salesAgnetName,
                        assignedCount      : 0,
                        verifiedCount      : 0,
                        listedCount        : 0,
                    }
                for (j=0;j<count[i].status.length;j++) {
                    if(count[i].status[j]=== "New"){
                        salesAgent.assignedCount+=1;
                    }else if(count[i].status[j]=== "Verified"){
                        salesAgent.verifiedCount+=1;
                    }else if(count[i].status[j]=== "Listed"){
                        salesAgent.listedCount+=1;
                    }
                }
                salesAgentCount.push(salesAgent);
             }
             // console.log("salesAgentCount",salesAgentCount);
             if(i === count.length){
                res.status(200).json(salesAgentCount);
             }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};