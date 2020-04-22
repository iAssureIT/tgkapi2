const mongoose    = require("mongoose");

const Messages    = require('../models/messages');
const Properties  = require('../models/properties');
const Users             = require('../../coreAdmin/models/users');
const InterestedProps = require('../models/interestedProperties');

var ObjectId      = require('mongodb').ObjectID;

//If coversation between SA and FA already exist push messages in array else create new conversation.
exports.coversation = (req,res,next)=>{
  console.log("body=>",req.body)
  main();
  async function main(){
  var userName         = await getUserName(req.body.user_id);
  // console.log("user",userName);
  Messages.findOne({prop_id:req.body.prop_id})
  .exec()
  .then(messages=>{
    console.log("=>",messages)
    if(messages){
      Messages.updateOne(
        { "prop_id" : req.body.prop_id},
        {
          $push : {
              messages:{
                messageId    : new mongoose.Types.ObjectId(),
                user_id      : req.body.user_id,
                userName     : userName,
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
            "message": "Message insert successfully"
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
        // trans_id  : req.body.trans_id,
        messages  : [{
                         messageId    : new mongoose.Types.ObjectId(),
                         user_id      : req.body.user_id,
                         userName     : userName,
                         text         : req.body.text,
                         image        : req.body.image,
                         createdAt    : new Date()
                    }]
        })
        messages.save()
        .then(message=>{
          res.status(200).json({
              "message": "Conversation created successfully"
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
  }
};

function getUserName(user_id){
return new Promise(function(resolve,reject){
        Users.findOne({"_id" : user_id},{"profile.firstName":1})
             .exec()
             .then(user=>{
              
                resolve(user.profile.firstName);
             })
            .catch(err =>{
                res.status(500).json({
                    message : "User not found.",
                    error: err
                   });
            });
    });
};

//get data of coversation
exports.get_coversation_for_sa_query = (req,res,next)=>{
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
                    res.status(200).json({
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
                    messagesId        : conversation ? conversation._id : "",
                    messages          : conversation ? conversation.messages : ""
                  }); 
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

//get data of coversation
exports.get_coversation_for_client_query = (req,res,next)=>{
  // console.log("inside get conversation")
  InterestedProps.findOne({_id:req.params.trans_id})
  .exec()
  .then(interestedProperties=>{
    // console.log("interestedProperties=>",interestedProperties);
    if(interestedProperties){
       Properties.findOne({_id:interestedProperties.property_id})
      .exec()
      .then(property=>{
        if(property){
          Users.findOne({_id:property.salesAgent[0].agentID})
          .exec()
          .then(salesAgent=>{
            if(salesAgent){
              Users.findOne({_id:interestedProperties.fieldAgent[0].agentID})
              .exec()
              .then(fieldAgent=>{
                if(fieldAgent){
                  Messages.findOne({prop_id:interestedProperties.property_id})
                  .exec()
                  .then(conversation=>{
                    // console.log("conversation",conversation)
                      res.status(200).json({
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
                        messagesId        : conversation ? conversation._id : "",
                        messages          : conversation ? conversation.messages : ""
                      }); 
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
      });  
    }
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
        error: err
    });
  })
};
//delete messages
exports.delete_messages = (req,res,next)=>{
    Messages.deleteOne({"messages.messageId":req.params.messageId})
    .exec()
    .then(data=>{
        res.status(200).json("Message deleted");
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

//get data of coversation
exports.get_coversation= (req,res,next)=>{
  Messages.findOne({prop_id:req.params.prop_id})
      .exec()
      .then(conversation=>{
        console.log("conversation",req.params.prop_id)
            Properties.findOne({_id:req.params.prop_id})
            .exec()
            .then(property=>{
              console.log("property=>",property)
               res.status(200).json({
                    propertyId        : property._id,
                    propertyCode      : property.propertyCode,
                    propertyType      : property.propertyType,
                    transactionType   : property.transactionType,
                    propertyImages    : property.gallery.Images,
                    propertyLocation  : property.propertyLocation,
                    messagesId        : conversation ? conversation._id : "",
                    messages          : conversation ? conversation.messages : ""
                }); 
                
             })
            .catch(err=>{
              console.log(err);
              res.status(500).json({
                  error: err
              });  
            });
       })
      .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });  
      }); 
};

