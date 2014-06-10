var server = require('./server/server.js')

server.plugin(require('./plugins/sandbox'))

server.pipeline('postRequest', {headers: function(request, remand){
    var headers = {};
    // IE8 does not allow domains to be specified, just the *
    // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    request.reply.headers = headers
    remand(headers)
  }
})

server.port(5000).start(function(){
  console.log('server started')
})
