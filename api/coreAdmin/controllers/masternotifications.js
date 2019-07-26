const mongoose = require("mongoose");

const Masternotifications = require("../models/masternotifications");


exports.create_template = (req, res, next) => {
    var masternotificationData = req.body.templateName;
    console.log('masternotificationData ',req.body.templateName);
	Masternotifications.findOne({templateName:masternotificationData})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Master Notification Template Name already exists'
				});
			}else{
            const masterNotifications = new Masternotifications({
                _id             : mongoose.Types.ObjectId(),      
                templateType    : req.body.templateType,
                templateName    : req.body.templateName,
                subject         : req.body.subject,
                content         : req.body.content,
            });
            
            masterNotifications.save(
                function(err){
                    if(err){
                        console.log(err);
                        return  res.status(500).json({
                            error: err
                        });          
                    }
                    res.status(200).json({ 
                        message: 'New Notification Template created!',
                        data: masterNotifications
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
// Handle delete contact
exports.delete_template = function (req, res) {
    Masternotifications.deleteOne({
        _id: req.params.notificationmasterID
    }, function (err) {
        if(err){
            return res.json({
                error: err
            });
        }
        res.json({
            status: "success",
            message: 'Master notification deleted'
        });
    });
};
exports.detail_fetch = (req,res,next)=>{
    Masternotifications.findOne({_id:req.params.notificationmasterID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Master Notification not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.get_list = (req,res,next)=>{
    Masternotifications.find()
       
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

exports.update_notifications = (req,res,next)=>{
    // var roleData = req.body.role;
    Masternotifications.updateOne(
            { _id:req.params.notificationmasterID},  
            {
                $set:{
                    "templateType"    : req.body.templateType,
                    "templateName"    : req.body.templateName,
                    "subject"         : req.body.subject,
                    "content"         : req.body.content,
				
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){
				console.log('data =========>>>',data);
                res.status(200).json("Master notifications Updated");
            }else{
                res.status(401).json("Master notifications Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
// Handle update contact info

// exports.update = function (req, res) {
//     Masternotifications.findById(req.params.notificationID, function (err, masternotifications) {
//             if (err){
//                 res.send(err);
   
//             masternotifications.templateType = req.body.templateType;
//             masternotifications.templateName = req.body.templateName;
//             masternotifications.subject      = req.body.subject;
//             masternotifications.content      = req.body.content;
            
//     // save the contact and check for errors
//     masternotifications.save(function (err) {
//                 if (err)
//                     res.json(err);
//                 res.json({
//                     message: 'master notifications Info updated',
//                     data: masternotifications
//                 });
//             });
//         }
//         });
//     };