const mongoose	        = require("mongoose");
const ProjectSettings   = require('../models/projectSettings');


exports.create_projectSettings = (req, res, next) => {
    var projectSettingsData = req.body.type;
    console.log('projectSettingsData ',req.body.type);
	ProjectSettings.findOne({type:projectSettingsData})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Type is already exists'
				});
			}else{
            const projectsetting = new ProjectSettings({
                _id             : mongoose.Types.ObjectId(),      
                key             : req.body.key,
                secret          : req.body.secret,
                bucket          : req.body.bucket,
                region          : req.body.region,
                type            : req.body.type
            });
            
            projectsetting.save(
                function(err){
                    
                    if(err){
                        console.log(err);
                        return  res.status(500).json({
                            error: err
                        });          
                    }
                    res.status(200).json({ 
                        message: 'New Project Setting created!',
                        data: projectsetting
                    });
                }
            );
        }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.fetch_projectsettings = (req, res, next)=>{
    const type = req.params.type;
    console.log("type = |"+type+"|");
        ProjectSettings.findOne({"type": req.params.type})
            .exec()
            .then(data=>{
                console.log("data ",data);
                res.status(200).json(data);
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });            
}
exports.list_projectsettings = (req, res, next)=>{
    const type = req.params.type;
    console.log("type = |"+type+"|");
        ProjectSettings.find({})
            .exec()
            .then(data=>{
                console.log("data ",data);
                res.status(200).json(data);
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });            
}
