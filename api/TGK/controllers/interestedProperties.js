const mongoose	= require("mongoose");
const async = require("async");

const InterestedProps = require('../models/interestedProperties');
const Properties = require('../models/properties');


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
    InterestedProps .find({"buyer_id" : buyer_id})
                    .populate("Properties","_id")
                    .exec()
                    .then(data=>{
                        if(data){
                            console.log("1 data = ",data);
                            // async (data,result1)=>{
                            //     let result = await data.map((interestedProp) => {    
                            //         console.log("Result => ",result);
                            //         var myProp ={
                            //             buyer_id : interestedProp.buyer_id,
                            //             property_id : interestedProp.property_id,
                            //             createdAt : interestedProp.createdAt,
                            //             propertyData : {}
                            //         };
                            //         Properties.findOne({"_id": interestedProp.property_id})
                            //                     .exec()
                            //                     .then(propertyData => {
                            //                         myProp.propertyData = propertyData;
                            //                         // console.log("interestedProp = ",interestedProp);
                            //                     })
                            //                     .catch(err =>{
                            //                         console.log(err);
                            //                         res.status(500).json({
                            //                             message : "Some error in finding Property details",
                            //                             error: err
                            //                         });
                            //                     });
                            //         return myProp; 
                            //     });

                            //     if(!result.err){
                            //         console.log("Result => ",result);
                            //         res.status(200).json({result});
                            //     }
                            // }
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
    InterestedProps.deleteOne({_id:req.params.aellResidentialID})
        .exec()
        .then(data=>{
            res.status(200).json("Interested Property deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.deleteall_interestedProps = (req,res,next)=>{
    InterestedProps.deleteMany({})
        .exec()
        .then(data=>{
            res.status(200).json("All Interested Properties deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

