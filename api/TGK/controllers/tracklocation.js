const mongoose	= require("mongoose");
var ObjectID = require('mongodb').ObjectID;

const Tracklocation = require('../models/tracklocation');

exports.create_location = (req,res,next)=>{
	console.log("req.body=>",req.body)
	const tracklocation = new Tracklocation({
        _id                 : new mongoose.Types.ObjectId(),                    
        latitude            : req.body.latitude,
        longitude           : req.body.longitude,
        routeCoordinates    : req.body.routeCoordinates,
        distanceTravelled   : req.body.distanceTravelled,
        createdAt           : new Date()
    });
    console.log('tracklocation ',tracklocation);
    tracklocation.save()
        .then(data=>{
        	console.log("data=>",data)
            res.status(200).json("Coordinates Added");
        })
        .catch(err =>{
            console.log(err.message);
            res.status(500).json({
                error: err
            });
        });
};



