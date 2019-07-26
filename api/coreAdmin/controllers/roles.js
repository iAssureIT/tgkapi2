const mongoose	= require("mongoose");

const Role = require('../models/roles');

exports.create_role = (req,res,next)=>{
    var roleData = req.body.role;
	Role.findOne({role:roleData.toLowerCase()})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: ' Role already exists'
				});
			}else{
				const role = new Role({
                    _id         : new mongoose.Types.ObjectId(),
                    role        : roleData.toLowerCase(),
                    createdAt   : new Date()
                });
                role.save()
                    .then(data=>{
                        res.status(200).json("Role Added");
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

exports.list_role = (req,res,next)=>{
    Role.find()
        .select("role")
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

exports.detail_role = (req,res,next)=>{
    var roleData = req.params.role;
    Role.findOne({role:roleData.toLowerCase()})
        .select("role")
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Role not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_role = (req,res,next)=>{
    var roleData = req.body.role;
    Role.updateOne(
            { _id:req.body.id},  
            {
                $set:{
                    "role" : roleData.toLowerCase()
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data){
                res.status(200).json("Role Updated");
            }else{
                res.status(401).json("Role Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_role = (req,res,next)=>{
    Role.deleteOne({_id:req.params.roleID})
        .exec()
        .then(data=>{
            res.status(200).json("Role deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
