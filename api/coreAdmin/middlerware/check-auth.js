const jwt 				= require('jsonwebtoken');
const globalVariable	= require('../../../nodemon.js');
const Users 			= require('../models/users.js');

const auth = (req, res, next) => {
	if(req.headers.authorization){
	    const token = req.headers.authorization.split(" ")[1];
	    const data = jwt.verify(token, globalVariable.JWT_KEY,(err,decode)=>{
	    	if(err){
	    		console.log("err verify ",err);
				res.status(401).json("Not authorized to access this resource");
	    	}else{
	    		try{
	    			getData();
	    			async function getData(){
			    		const user = await Users.aggregate([
			        											{
			        												$match : { "_id" : decode.userId}
			        											},
														  		{
														    		$project: {
														      			loginToken: {$arrayElemAt: ["$services.resume.loginTokens", 1]}
														    		}
														  		},
														  		{
														    		$match: {"loginToken.hashedToken": token}
														  		}
														]);
			    		req.token = token;
			    		next();
	    			}
	    		}catch(error){
	    			res.status(401).send({ error: 'Not authorized to access this resource' })
	    		}
	    	}
	    });
	}else {
		res.status(401).send({ error: 'Not authorized to access this resource' });
	}
}
module.exports = auth
