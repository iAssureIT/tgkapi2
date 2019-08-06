const mongoose	= require("mongoose");

const Sellometers = require('../models/sellometers');

exports.create_sellometers = (req,res,next)=>{
  
				const sellometers = new Sellometers({
                    _id             : new mongoose.Types.ObjectId(),                    
                    city			: req.body.city, 
                    area			: req.body.area,
                    subArea			: req.body.subArea,   
                    socity			: req.body.socity,   
                    propertyClass 	: req.body.propertyClass,
                    index 			: req.body.index,
                    createdAt       : new Date()
                });
                console.log('sellometers ',sellometers);
                sellometers.save()
                    .then(data=>{
                        res.status(200).json("Sell-O-Meter-Added");
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
		
	
};



exports.list_sellometers = (req,res,next)=>{
    Sellometers.find()
       
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
}

exports.fetch_sellometers = (req,res,next)=>{
    Sellometers.find({_id : req.params.sellometersID})
       
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
}


exports.update_sell_O_meteor = (req,res,next)=>{
    // var roleData = req.body.role;
    Sellometers.updateOne(
            { _id:req.params.sellometersID},  
            {
                $set:{
                    "city"			    : req.body.city, 
                    "area"			    : req.body.area,
                    "subArea"			: req.body.subArea,   
                    "socity"			: req.body.socity,   
                    "propertyClass" 	: req.body.propertyClass,
                    "index" 			: req.body.index,
				
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){
				console.log('data =========>>>',data);
                res.status(200).json("Sell-O-Meter-Updated");
            }else{
                res.status(401).json("Sell-O-Meter-Not-Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.delete_sellometers = (req,res,next)=>{
    Sellometers.deleteOne({_id:req.params.sellometersID})
        .exec()
        .then(data=>{
            res.status(200).json("Sellometer-Deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}










