var Hapi = require('hapi');

// Create a server with a host and port
var server = Hapi.createServer('localhost', 8000);

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

// Start the server
server.start();

function serveDir(request, reply) {
  reply('Hello')
}
