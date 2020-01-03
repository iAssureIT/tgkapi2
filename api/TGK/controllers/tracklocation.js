const mongoose	= require("mongoose");

const tracklocation = require('../models/tracklocation');

exports.create_location = (req,res,next)=>{
	const tracklocation = new tracklocation({
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
            res.status(200).json("Coordinates Added");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

