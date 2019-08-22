const mongoose = require("mongoose");

const Masternotifications = require("../models/masternotifications");
const User          = require('../models/users');
const nodeMailer                      = require('nodemailer');


exports.create_template = (req, res, next) => {
    var masternotificationData = req.body.templateName;
    var masternotificationtemptype = req.body.templateType
    console.log('masternotificationData ',req.body.templateName);
	Masternotifications.findOne({templateName:masternotificationData, templateType:masternotificationtemptype})
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



//get getEmailByUserId - Rushikesh Salunkhe
function getEmailByUserId(toUserId){
    return new Promise(function(resolve,reject){
    User
    .findOne({"_id":toUserId})
    .exec()
        .then(data=>{
            resolve(data.emails[0].address);          
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

        });
}


//get TemplateDeatails - Rushikesh Salunkhe
function getTemplateDetails(templateName,variables){
    return new Promise(function(resolve,reject){
        Masternotifications
        .findOne({"templateName":templateName})
        .exec()
        .then(NotificationData=>{
                    // console.log('serverside NotificationData: ', NotificationData);
                    if(NotificationData){
                        var content = NotificationData.content;
                        var words = content.split(' ');
                        var tokens = [];
                        var n = 0;
                        for(i=0;i<words.length;i++){
                            if(words[i].charAt(0)=='['){
                                tokens[n] = words[i];
                                if(tokens[n].substr(tokens[n].length - 1) != ']'){
                                   tokens[n] = tokens[n].substr(0,tokens[n].length - 1) ;
                                }
                                n++;
                            }
                        }
                        var numOfVar = Object.keys(variables).length;

                        for(i=0; i<numOfVar; i++){
                            content = content.replace(tokens[i],variables[i].value);
                        }
                        var tData={
                            content:content,
                            subject:NotificationData.subject
                        }
                        resolve(tData);          
                    }//NotificationData
                    
            })
            .catch(err =>{
                console.log(err);
                err.status(500).json({
                    error: err
                });
            });
        }); 
    }


//send Mail Notification -Rushikesh Salunkhe
exports.send_notifications = (req,res,next)=>{
    const senderEmail = 'testtprm321@gmail.com';
    const senderEmailPwd = 'tprm1234';

    console.log(req.body);

    let transporter = nodeMailer.createTransport({                
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: senderEmail,
            pass: senderEmailPwd
        }
    });
    main();
    async function main(){
        const toUserId = await getEmailByUserId(req.body.toUserId); 
        const templateDetails = await getTemplateDetails(req.body.templateName, req.body.variables);

        var mailOptions = {                
            from        : '"TGK Admin" <'+senderEmail+'>', // sender address
            to          : toUserId, // list of receiver
            subject     : templateDetails.subject, // Subject line
            html        : templateDetails.content, // plain text body
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {                    
                console.log("send mail error",error);
                return "Failed";
            }
            if(info){
                // return "Success";
                res.status(200).json({              
                    message: "Success",
                    // return "Success",
                });
            }

            res.render('index');
        });

    }
    
}



