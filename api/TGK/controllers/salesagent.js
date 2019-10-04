
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
                for (var i = property.length - 1; i >= 0; i--) {
                    Users.find({"_id":property[i].owner_id})
                    .exec()
                    .then(user=>{
                        console.log("user",user);
                        if(user){
                            var propertyObj ={
                            	propertyOwner:{
                            		userName : user[0].profile.fullName,
	                                mobNumber: user[0].mobileNumber,
	                                emailId  : user[0].profile.emailId
                            	}
                            }
                            if(propertyObj){
                                // property[i].push(propertyObj);
                                console.log("Inside obj");
                                property[i] = {...property[i]._doc, propertyObj};
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
                "status" : req.body.status,
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