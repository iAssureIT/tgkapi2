// const http 				= require('http');
// const app 				= require('./app'); // app file include
// const globalVariable 	= require('./nodemon.js');
// const port = process.env.PORT || globalVariable.port;
// console.log("This app is working on port => ",port)

// const server = http.createServer(app);

// server.listen(port);


const axios				= require('axios');
const http 				= require('http');
const app 				= require('./app'); // app file include
const globalVariable 	= require('./nodemon.js');
const port = process.env.PORT || globalVariable.port;

console.log("This app is working on port => ",port)

const server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connection', (client) => { 

	client.on('room',(room)=> {
    	console.log("room",room)
        client.join(room);
    });
	client.on('messageValues', (messageValues) => {
    	// console.log("messageValues = ",messageValues);
    	axios.post(messageValues.url+'/api/messages/post/coversation',messageValues)
  		.then(data=>{
	    	axios.get(messageValues.url+'/api/messages/get/getConversation/'+messageValues.prop_id)
	  		.then(conversation=>{
	  			var room = messageValues.prop_id; 
  				io.sockets.in(room).emit('message', conversation.data.messages);
	  		})
	  		.catch(err=>{
	  			console.log(err)
	  		})
  		 })
  		.catch(err=>{
  			console.log(err)
  		})
  	});
 });

server.listen(port);