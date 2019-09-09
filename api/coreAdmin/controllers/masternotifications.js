const mongoose = require("mongoose");

const Masternotifications = require("../models/masternotifications");
const User          = require('../models/users');
const nodeMailer                      = require('nodemailer');
const Companysettings = require('../models/companysettings');


exports.create_template = (req, res, next) => {
    var masternotificationData = req.body.templateName;
    var masternotificationtemptype = req.body.templateType
    // console.log('masternotificationData ',req.body.templateName);
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
				// console.log('data =========>>>',data);
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




//send Mail Notification -Rushikesh Salunkhe
exports.send_notifications = (req,res,next)=>{
    // console.log('req',req.body);
    const senderEmail = 'testtprm321@gmail.com';
    const senderEmailPwd = 'tprm1234';

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
        var userProfile = {};
        if(req.body.toUserId === "admin"){
            toEmail = "testtprm321@gmail.com"; 
        }else{
            userProfile = await getProfileByUserId(req.body.toUserId);
            if(userProfile && userProfile!== null & userProfile!==""){
                // console.log("userProfile",userProfile);
                toEmail = userProfile.profile.emailId;
            }
        }
        const templateDetails = await getTemplateDetails(req.body.templateName, req.body.variables);

        var mailOptions = {                
            from        : '"TGK Admin" <'+senderEmail+'>', // sender address
            to          : toEmail , // list of receiver
            subject     : templateDetails.subject, // Subject line
            html        : templateDetails.content, // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {                    
                console.log("send mail error",error);
                res.status(500).json({              
                    message: "Send Email Failed",
                });
            }
            if(info){
                res.status(200).json({              
                    message: "Mail Sent Successfully",
                });
            }
            res.render('index');
        });

    }
    
}

//get getEmailByUserId - Rushikesh Salunkhe
function getProfileByUserId(toUserId){
    return new Promise(function(resolve,reject){
        // console.log("getProfileByUserId",toUserId);
    User
    .findOne({"_id":toUserId})
    .exec()
        .then(data=>{
            // console.log('data',data);
            resolve(data);          
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

        });
}

// function getAdminEmail(){
//     //First record in CompanySetting belongs to Company
//     return new Promise(function(resolve,reject){
//         Companysettings
//             .find({})
//             .exec()
//             .then(data=>{
//                 var email = data[0].companyEmail;
//                 resolve(email);
//             })
//             .catch(err =>{
//                 console.log(err);
//                 res.status(500).json({
//                     error: err
//                 });
//             });
 
//     })

// }

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
                        if(content.indexOf('[') > -1 ){
                            var wordsplit = content.split('[');
                        }

                        var tokens = [];
                        var n = 0;
                        for(i=0;i<wordsplit.length;i++){
                            if(wordsplit[i].indexOf(']') > -1 ){
                                tokensArr = wordsplit[i].split(']');
                                tokens[n] = tokensArr[0];
                                n++;
                            }
                        }
                        var numOfVar = Object.keys(variables).length;

                        for(i=0; i<numOfVar; i++){
                            var tokVar = tokens[i].substr(1,tokens[i].length-2);
                            content = content.replace(tokens[i],variables[tokens[i]]);
                        }
                        content = content.split("[").join("'");
                        content = content.split("]").join("'");
                        // console.log("content = ",content);
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

