	const express 						= require ('express');
	const app 							= express();
	const morgan 						= require('morgan');// morgan call next function if problem occure
	const bodyParser 					= require('body-parser');// this package use to formate json data 
	const mongoose 						= require ('mongoose');
	
	const dbname = "qatgk";
	global.JWT_KEY = "secret";

	mongoose.connect('mongodb://localhost/'+dbname,{
		useNewUrlParser: true
	})
	mongoose.promise = global.Promise;

	app.use(morgan("dev"));
	app.use('/uploads', express.static('uploads'));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
		if (req.method === "OPTIONS") {
			res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
			return res.status(200).json({});
		}
		next();
	});

	// CoreAdmin Routes 
	const masternotificationsurl 			= require("./api/coreAdmin/routes/masternotifications");
	const usersOTPBasedLogin 				= require("./api/coreAdmin/routes/otpBasedLogin");
	const usersurl 							= require("./api/coreAdmin/routes/users");	
	// const companyserttingsurl 				= require("./api/coreAdmin/routes/companysettings");
	const rolesurl 							= require("./api/coreAdmin/routes/roles");
	const projectSettingsurl 				= require("./api/coreAdmin/routes/projectSettings");
	

	app.use("/api/masternotifications",masternotificationsurl);
	app.use("/api/usersotp",usersOTPBasedLogin);
	app.use("/api/users",usersurl);
	// app.use("/api/companysettings",companyserttingsurl);
	app.use("/api/roles",rolesurl);
	app.use("/api/projectSettings",projectSettingsurl);

	
	const TgkSpecificCompanysettingsurl 	= require("./api/coreAdmin/routes/tgkspecific/tgkSpecificcompanysettings");
	// const TgkSpecificuserssurl 				= require("./api/coreAdmin/routes/tgkspecific/tgkspecificusers");
	
	app.use("/api/tgkSpecificcompanysettings",TgkSpecificCompanysettingsurl);
	// app.use("/api/users",TgkSpecificuserssurl);

	
	
	// TGK Routes
	const propertiesurl 			= require("./api/TGK/routes/properties");
	const sellometeorurl 			= require("./api/TGK/routes/sellometers");
	const masteramenitiesurl 		= require("./api/TGK/routes/masteramenities");
	const mastersellometerurl 		= require("./api/TGK/routes/mastersellometers");
	const interestedPropertiesurl 		= require("./api/TGK/routes/interestedProperties");



	app.use("/api/properties",propertiesurl);
	app.use("/api/sellometers",sellometeorurl);
	app.use("/api/masteramenities",masteramenitiesurl);
	app.use("/api/mastersellometers",mastersellometerurl);
	app.use("/api/interestedProperties",interestedPropertiesurl);



	app.use((req, res, next) => {
		const error = new Error("Not found");
		error.status = 404;
		next(error);
	});

	app.use((error, req, res, next) => {
		res.status(error.status || 500);
		res.json({
				error: {
				message: error.message
				}
			});
	});

	module.exports = app;