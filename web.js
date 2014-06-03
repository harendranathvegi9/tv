var Hapi = require('hapi');

console.log('starting')
// Create a server with a host and port
var server = Hapi.createServer('localhost', 8002);

// Add the route
server.route({
    method: 'GET',
    path: '/',
    handler: serveDir
});

// Add the route
server.route({
    method: 'GET',
    path: '/snapshots/{file?}',
    handler: {
      directory:{
        path:'../snapshots',
        listing:true
      }
    }
});

console.log('actual start')
// Start the server
server.start();

function serveDir(request, reply) {
	console.log('serve')  
	reply('Hello')
}
