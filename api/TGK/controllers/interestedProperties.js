const mongoose	= require("mongoose");

const InterestedProps = require('../models/interestedProperties');
const Properties = require('../models/properties');
const ObjectId = require('mongodb').ObjectID;


exports.create_interestedProps = (req,res,next)=>{ 
    const interestedProps = new InterestedProps({
            _id                     : new mongoose.Types.ObjectId(),
            buyer_id                : req.body.buyer_id,
            property_id             : req.body.property_id,
            createdAt               : new Date()
    });

    interestedProps.save()
        .then(data=>{        
            res.status(200).json({
                "message" : 'Property Interest from this Buyer is Saved',
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                message : "Some error in saving the Interested Buyer",
                error: err
            });
        });
		           
};

exports.detail_interestedProps = (req, res, next)=>{
	var id = req.params.sellResidentsID;
	InterestedProps.findOne({_id:id})
		// .select("profile")
		.exec()
		.then(data =>{
			res.status(200).json(data);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
}

exports.list_myInterestedProps = (req,res,next)=>{
    console.log('list');
    const buyer_id = req.params.user_id;
    InterestedProps .find({"buyer_id" : buyer_id},{"property_id":1,"_id":0})
                    .sort({"createdAt":-1})
                    .exec()
                    .then(property_ids=>{
                        var propertyIds = property_ids.map((a)=>a.property_id)
                        console.log("property_ids",propertyIds)
                        if(propertyIds){
                            Properties
                                .find({_id : {$in:propertyIds}})
                                .exec()
                                .then(properties=>{
                                    console.log(properties)
                                    res.status(200).json(properties);
                                })
                                .catch(err =>{
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });

                        }else{
                            res.status(200).json({"message" : 'Interested Properties not found'});
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
}


exports.delete_interestedProps = (req,res,next)=>{
    console.log("uid=>",req.params.buyer_id,"property_id=>",req.params.property_id)
    InterestedProps.deleteOne({buyer_id:req.params.buyer_id,property_id:req.params.property_id})
        .exec()
        .then(data=>{
            console.log("data",data);
            res.status(200).json("Interested Property deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

// exports.deleteall_interestedProps = (req,res,next)=>{
//     InterestedProps.deleteMany({})
//         .exec()
//         .then(data=>{
//             res.status(200).json("All Interested Properties deleted");
//         })
//         .catch(err =>{
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// }

