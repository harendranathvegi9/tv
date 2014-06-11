var fs = require('fs')
var send = require('send')
var http = require('http')
var url = require('url')

var router = require('routes')()

var site = function(req, res){
  var parsed = url.parse(req.url)
  var pathname = parsed.pathname
  var route = router.match(pathname)
  if(!route) return res.error(404)
  req.route = route
  route.fn(req, res)
}

router.addRoute('/app/*', function(req, res){
  console.log('app', __dirname+url.parse(req.url).pathname)
  send(req, __dirname+url.parse(req.url).pathname).pipe(res);
})

router.addRoute('/snapshot/:id/csv', function(req, res){
  var id = req.route.params.id
  console.log('SNAPSHOT CSV', '/snapshots/output/ranked--'+id+'.csv')

  res.setHeader('Content-disposition', 'attachment; filename=ranked--'+id+'.csv');
  send(req, 'ranked--'+id+'.csv', {root: __dirname+'/../snapshots/output/'}).pipe(res);
})

router.addRoute('/*', function(req, res){
  console.log('html', url.parse(req.url).pathname)
  send(req, __dirname+'/index.html').pipe(res);
})

http.createServer(site).listen(5001)
