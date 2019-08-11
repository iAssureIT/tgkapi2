const mongoose	= require("mongoose");

const Properties        = require('../models/properties');


// ===================== round robin ================
exports.searchProperties = (req,res,next)=>{

  var selector = [];

// for transactionType---------------------------------
  if(req.body.transactionType != ""){
    selector.push({"transactionType" : req.body.transactionType }) ;
  }
// for propertyType ----------------------------------------------------
  if(req.body.propertyType != ""){
    selector.push({"propertyType" : req.body.propertyType}) ;
  }
// for city-------------------------------------------------------
  if(req.body.location != ""){
    selector.push({"propertyLocation.city" : req.body.location}) ;
  }
// for floor----------------------------------------------------------
  // if(req.body.floor != ""){
  //     if(req.body.floor.includes("-"))
  //     {
  //       var sepFloor = req.body.floor.split("-");
  //       var minFloor = sepFloor[0];
  //       var maxFloor = sepFloor[1];

  //         if(maxFloor != ""){
  //           selector.push({"floor" : { $lte : maxFloor}} ) ;
  //         }
  //         if(minFloor != ""){
  //           selector.push({"floor" : { $gte : minFloor}} ) ;
  //         }
  //     }elseif(req.body.floor.includes("-1"))
  //     {
  //          selector.push({"floor" : { $eq : "-1"}} ) ;
  //     }

  //   if(req.body.floor == ">10" )
  //   {
  //     selector.push({"floor" : { $gte : 11}} ) ;
  //   }

  //   if(req.body.floor == "0" )
  //   {
  //     selector.push({"floor" :  { $eq : "0"} })
  //   }
  
  // }

//  for property age----------------------------------
  if(req.body.propertyAge != ""){
         selector.push({"propertyDetails.ageofProperty" : req.body.propertyAge } ) ; 
  }

// for area--------------------------------------------
  // if(req.body.areaMax != ""){
  //   selector.push({"propertyDetails.superArea" : { $lte : req.body.areaMax}} ) ;
  // }
  // if(req.body.areaMin != ""){
  //   selector.push({"propertyDetails.superArea" : { $gte : req.body.areaMin}} ) ;
  // }

// for furnished status--------------------------------------------------------
   if(req.body.furnishedStatus != ""){
     selector.push({"propertyDetails.furnishedStatus" : req.body.furnishedStatus } ) ; 
   }
// for budget----------------------------------------------------------------------
  if(req.body.budget != ""){
    selector.push({"financial.totalPrice" : { $lte : req.body.budget }} ) ;
  }

// for BHK--------------------------------------------------------------
  if(req.body.flatType)
  {
     selector.push({"propertyDetails.bedrooms" : req.body.flatType } ) ; 
  }
  // var selector = JSON.stringify(transTypeSelector) + "," + JSON.stringify(propertyTypeSelector) + "," + JSON.stringify(citySelector)  ;
  console.log("selector = ", selector);
  console.log("request = " , req.body);

  Properties.find({ $and : selector })
      .exec()
      .then(searchResults=>{
          if(searchResults){
              // console.log("searchResults = ",searchResults);
              res.status(200).json(searchResults);
          }else{
              res.status(404).json('Properties not found');
          }
      })
      .catch(err =>{
          console.log(err);
          res.status(500).json({
              message : "No Data Found",
              error   : err
          });
      });

              // res.status(200).json();


};

/*----------------Search Result--------------------*/

exports.search_result = (req,res,next)=>{
    // console.log("input = ",req.body);
    Properties.find({
                        "transactionType":req.body.transactionType,
                        "propertyType":req.body.propertyType,
                        "propertyLocation.city": req.body.location,
                      })
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Properties Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
