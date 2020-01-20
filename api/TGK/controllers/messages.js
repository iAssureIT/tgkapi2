const mongoose    = require("mongoose");

const Messages    = require('../models/messages');
const Properties  = require('../models/properties');
const Users             = require('../../coreAdmin/models/users');

var ObjectId      = require('mongodb').ObjectID;

//If coversation between SA and FA already exist push messages in array else create new conversation.
exports.coversation = (req,res,next)=>{
  Messages.findOne({prop_id:req.body.prop_id})
  .exec()
  .then(messages=>{
    if(messages && messages.length>0){
      Messages.updateOne(
        { "prop_id" : req.body.prop_id},
        {
          $push : {
              messages:{
                user_id      : req.body.user_id,
                text         : req.body.text,
                image        : req.body.image,
                createdAt    : new Date()
              }
          }
        }
      )
      .exec()
      .then(message=>{
        res.status(200).json({
            data: "Message insert successfully"
        });
      })
      .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
      })
    }else{
      const messages =new Messages({
        _id       : new mongoose.Types.ObjectId(),
        prop_id   : req.body.prop_id,
        trans_id  : req.body.trans_id,
        messages  : [{
                         user_id      : req.body.user_id,
                         text         : req.body.text,
                         image        : req.body.image,
                         createdAt    : new Date()
                    }]
        })
        messages.save()
        .then(message=>{
          res.status(200).json({
              data: "Conversation created successfully"
          });

        })
        .catch(err=>{
          console.log(err);
          res.status(500).json({
              error: err
          });
        })
      }
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
        error: err
    });
  })
};


//get data of coversation
exports.get_coversation = (req,res,next)=>{
  Properties.findOne({_id:req.params.prop_id})
  .exec()
  .then(property=>{
    if(property){
      Users.findOne({_id:property.salesAgent[0].agentID})
      .exec()
      .then(salesAgent=>{
        if(salesAgent){
          Users.findOne({_id:property.fieldAgent[0].agentID})
          .exec()
          .then(fieldAgent=>{
            if(fieldAgent){
              Messages.findOne({prop_id:req.params.prop_id})
              .exec()
              .then(conversation=>{
                if(conversation){
                  var coversation = {
                    propertyId        : property._id,
                    propertyCode      : property.propertyCode,
                    propertyType      : property.propertyType,
                    transactionType   : property.transactionType,
                    propertyImages    : property.gallery.Images,
                    propertyLocation  : property.propertyLocation,
                    salesAgent_id     : salesAgent._id,
                    salesAgentName    : salesAgent.profile.firstName,
                    fieldAgent_id     : fieldAgent._id,
                    fieldAgentName    : fieldAgent.profile.firstName,
                    messagesId        : conversation._id,
                    messages          : conversation.messages
                  }
                  res.status(200).json({
                    data: coversation
                  }); 
                }
               })
              .catch(err=>{
                console.log(err);
                res.status(500).json({
                    error: err
                });  
              });  
            }
          })
          .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
          })
        }
      })
      .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
      })
    }
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
        error: err
    });
  })
};
