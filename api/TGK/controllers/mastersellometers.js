const mongoose	= require("mongoose");

const MasterSellometers = require('../models/mastersellometer');

// exports.create_mastersellometers = (req,res,next)=>{
  
// 				const mastersellometers = new MasterSellometers({
//                     _id                 : new mongoose.Types.ObjectId(),                    
//                     class		    	: req.body.class, 
//                     earnings			: req.body.earnings,                    
//                     createdAt           : new Date()
//                 });
                
//                 mastersellometers.save()
//                     .then(data=>{
//                         res.status(200).json("Master-Sell-O-Meter-Added");
//                     })
//                     .catch(err =>{
//                         console.log(err);
//                         res.status(500).json({
//                             error: err
//                         });
//                     });
		
	
// };

exports.create_mastersellometers = (req,res,next)=>{
    var mastersellometersData = req.body.class;
    console.log('mastersellometersData ',req.body.class);
	MasterSellometers.findOne({class:mastersellometersData})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Master sell O meters "Class" already exists'
				});
			}else{
				const mastersellometers = new MasterSellometers({
                    _id                 : new mongoose.Types.ObjectId(),                    
                    class		    	: req.body.class, 
                    earnings			: req.body.earnings,  
                    createdAt           : new Date()
                });
                // console.log('mastersellometers ',mastersellometers);
                mastersellometers.save()
                    .then(data=>{
                        res.status(200).json("Master-Sell-O-Meter-Added");
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

exports.list_mastersellometers = (req,res,next)=>{
    MasterSellometers.find()
       
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

exports.fetch_mastersellometers = (req,res,next)=>{
    MasterSellometers.find({_id : req.params.mastersellometersID})
       
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


exports.update_master_sell_O_meteor = (req,res,next)=>{
    // var roleData = req.body.role;
    MasterSellometers.updateOne(
            { _id:req.params.mastersellometersID},  
            {
                $set:{
                    "class"		    	: req.body.class, 
                    "earnings"			: req.body.earnings,
				
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){
				console.log('data =========>>>',data);
                res.status(200).json("Master-Sell-O-Meter-Updated");
            }else{
                res.status(401).json("Master-Sell-O-Meter-Not-Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.delete_mastersellometers = (req,res,next)=>{
    MasterSellometers.deleteOne({_id:req.params.mastersellometersID})
        .exec()
        .then(data=>{
            res.status(200).json("Master-Sellometer-Deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
