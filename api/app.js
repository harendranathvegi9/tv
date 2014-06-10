var server = require('./server/server.js')

server.port(5000).start(function(){
  console.log('server started')
})
