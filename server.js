const http = require('http');
const app = require('./app'); // app file include
const port = process.env.PORT || 50012;

const server = http.createServer(app);

server.listen(port);


