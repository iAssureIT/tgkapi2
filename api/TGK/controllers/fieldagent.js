const mongoose	= require("mongoose");
const Properties        = require('../models/properties');
const Sellometers = require('../models/sellometers');
const MasterSellometers = require('../models/mastersellometer');
const Users             = require('../../coreAdmin/models/users');
const InterestedProps = require('../models/interestedProperties');
var ObjectID = require('mongodb').ObjectID;

// ---------------------------------API To get Field Agent List as per status----------------------------

exports.list_Properties_fieldAgent_type = (req,res,next)=>{

    Properties.find({
                            "fieldAgent.agentID" : (req.params.fieldAgentID),
                            "fieldAgent.status"  : "Active",
                            "status"                : req.params.status,
                            "createdAt"             : {$ne : new Date()}
                    })
                .sort({"updatedAt":1})
                .exec()
                .then(data=>{
                    if(data.length > 0){
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


