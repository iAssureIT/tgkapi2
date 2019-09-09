const mongoose	= require("mongoose");

const Masteramenities = require('../models/masteramenities');

exports.create_masteramenities = (req,res,next)=>{
    var masteramenitiesData = req.body.amenity;
    console.log('masteramenitiesData ',req.body.amenity);
	Masteramenities.findOne({amenity:masteramenitiesData})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: ' Master Amenities already exists'
				});
			}else{
				const amenity = new Masteramenities({
                    _id                 : new mongoose.Types.ObjectId(),                    
                    amenity             : req.body.amenity,
                    createdAt           : new Date()
                });
                console.log('amenity ',amenity);
                amenity.save()
                    .then(data=>{
                        res.status(200).json("Master-Amenities-Added");
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
			}
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.list_masteramenities = (req,res,next)=>{
    Masteramenities.find()
       
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

exports.fetch_masteramenities = (req,res,next)=>{
    Masteramenities.find({_id : req.params.amenitiesID})
       
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
exports.update_masteramenities = (req,res,next)=>{
    // var roleData = req.body.role;
    Masteramenities.updateOne(
            { _id:req.params.amenitiesID},  
            {
                $set:{
                    "amenity"             : req.body.amenity,
				
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){
				console.log('data =========>>>',data);
                res.status(200).json("Master-Amenities-Updated");
            }else{
                res.status(401).json("Master-Amenities-Not-Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


exports.delete_masteramenities = (req,res,next)=>{
    Masteramenities.deleteOne({_id:req.params.amenitiesID})
        .exec()
        .then(data=>{
            res.status(200).json("Master-Amenities-Deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
