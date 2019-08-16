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
  var propertyType = req.body.propertyType;
  if(propertyType !== ""){
    selector.push({"propertyType" : propertyType});
  }

// for city-------------------------------------------------------
  if(req.body.location != ""){
    var loc = req.body.location.trim();
    var locArray = [];

    if(loc.indexOf(',') > -1){
      var loc = req.body.location.split(',');
      locArray.push({$and : [{"propertyLocation.area" : loc[0].trim()},{"propertyLocation.city" : loc[1].trim()}] } );
      locArray.push({$and : [{"propertyLocation.subArea" : loc[0].trim()},{"propertyLocation.city" : loc[1].trim()}] } );
    }else{
      locArray.push({"propertyLocation.subArea" : loc.trim()});      
      locArray.push({"propertyLocation.area" : loc.trim()});
      locArray.push({"propertyLocation.city" : loc.trim()});
    }

    selector.push({$or : locArray });

  }

// for floor----------------------------------------------------------
  if(req.body.floor != ""){
      if(req.body.floor.includes("-"))
      {
        var sepFloor = req.body.floor.split("-");
        var minFloor = sepFloor[0];
        var maxFloor = sepFloor[1];

        if(maxFloor != ""){
          selector.push({"floor" : { $lte : maxFloor}} ) ;
        }
        if(minFloor != ""){
          selector.push({"floor" : { $gte : minFloor}} ) ;
        }
      }else if(req.body.floor.includes("-1"))
      {
           selector.push({"floor" : { $eq : "-1"}} ) ;
      }

    if(req.body.floor == ">10" )
    {
      selector.push({"floor" : { $gte : 11}} ) ;
    }

    if(req.body.floor == "0" )
    {
      selector.push({"floor" :  { $eq : "0"} })
    }
  
  }


// for propertySubType ----------------------------------------------------
  var propSubType = req.body.propertySubType;
  if(propSubType.length > 0){
    var propSTArr = [];
    for(var i=0; i<propSubType.length; i++){
      propSTArr.push({"propertySubType" : propSubType[i]});
    }
    if(i>=propSubType.length){
      selector.push({$or : propSTArr});
    }
  }

// for budget----------------------------------------------------------------------
  if(req.body.budget != ""){
    selector.push({"financial.totalPrice" : { $lte : req.body.budget }} ) ;
  }


// for BHK ----------------------------------------------------
  var flatType = req.body.flatType;
  if(flatType.length > 0){
    var flatTypeArr = [];

    for(var i=0; i<flatType.length; i++){
      flatTypeArr.push({"propertyDetails.bedrooms" : flatType[i]});
    }

    if(i >= flatType.length){
      selector.push({$or : flatTypeArr});
    }
  }

//----- For Furnished Status --------------------------------------------------------
  if(req.body.furnishedStatus != ""){
    selector.push({"propertyDetails.furnishedStatus" : req.body.furnishedStatus } ) ; 
  }


//  for property age----------------------------------
  if(req.body.propertyAge != ""){
    selector.push({"propertyDetails.ageofProperty" : req.body.propertyAge } ) ; 
  }


//----- For Floor ----------------------------------------------------
  if(req.body.floor != ""){
    if(req.body.floor.includes("-")){
      var sepFloor = req.body.floor.split("-");
      var minFloor = sepFloor[0];
      var maxFloor = sepFloor[1];
      selector.push({"floor" : { $gte : minFloor}}) ;
      selector.push({"floor" : { $lte : maxFloor}}) ;
    }

    if(req.body.floor === "-1" || req.body.floor === "0"){
      selector.push({"floor" : req.body.floor});
    }

    if(req.body.floor === ">10"){
      selector.push({"floor" : { $gte : '11'}} ) ;
    }

  }

//----- For Availability ----------------------------------------------------
  if(req.body.availability != ""){
    var availability = req.body.availability;
    var d = new Date();
    var month = '' + (d.getMonth() + 1);  var month2  = month;
    var day   = '' + d.getDate();         var day2    = day;
    var year  = d.getFullYear();          var year2   = year;

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    var currDate =  year+'-'+month+'-'+day;
    var day2 = parseInt(day) + parseInt(availability);

    if(day2 >= 30){
      day2 = day2 - 30;
      month2 = month + 1;
    }
    if(month2 > 12){
      month2 = 1;
      year2 = year + 1;
    }
    if (month2.length < 2) month2 = '0' + month2;
    if (day2.length < 2) day2 = '0' + day2;
    var compareDate = year2+'-'+month2+'-'+day2;

    if(availability === "0"){
      selector.push({"financial.availableFrom" : {$lte : currDate} });
    }

    if(availability === "14" || availability === "30"){
      selector.push({"financial.availableFrom" : {$gt : currDate, $lte : compareDate } });
    }

    if(availability === "31"){
      selector.push({"financial.availableFrom" : {$gt : compareDate } });
    }

  }

  // console.log("selector = ", JSON.stringify(selector));

  Properties.find({ $and : selector })
      .sort({"propertyCreatedAt" : -1})
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

