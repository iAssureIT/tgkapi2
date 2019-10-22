
const mongoose	= require("mongoose");

const Properties        = require('../models/properties');
const Users             = require('../../coreAdmin/models/users');


////////////////////////////SA API////////////////////////////

exports.property_sa_displaylist = (req,res,next)=>{
    Properties.find(
            {
                status:req.body.status
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
    console.log("update_approvedlist",req.body);
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
    Properties.find()        
        .exec()
        .then(property=>{
            // console.log("property for count------------>",property);
            if(property){

                var selectedData = property.filter((element)=>{
                    return element.salesAgent.agentID == req.params.salesAgentID
                })

                 console.log("selectedData----------->",selectedData);

                // {
                //         "salesAgent.agentID" : ObjectID(req.params.salesAgentID),
                //         "salesAgent.status"  : "Active",
                //     }

                var WIPData = property.filter((WIPdata)=>{return WIPdata.status==="WIP"});
                var NEWData = property.filter((WIPdata)=>{return WIPdata.status==="New"});
                var RELISTINGData = property.filter((WIPdata)=>{return WIPdata.status==="ReListing"});
                var VERIFIEDData = property.filter((WIPdata)=>{return WIPdata.status==="Verified"});
                var LISTEDData  = property.filter((WIPdata)=>{return WIPdata.status==="Listed"});

                var WIPCount = WIPData.length;
                var NEWCount = NEWData.length;
                var RELISTINGCount = RELISTINGData.length;
                var VERIFIEDCount = VERIFIEDData.length;
                var LISTEDCount = LISTEDData.length;
                // if(i<0){
                  res.status(200).json({"WIPCount":WIPCount,"NEWCount":NEWCount,"RELISTINGCount":RELISTINGCount,"VERIFIEDCount":VERIFIEDCount,"LISTEDCount":LISTEDCount});
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


