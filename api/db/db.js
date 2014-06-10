var multilevel = require('multilevel');
var net = require('net');
var level = require('level');

var db = level(__dirname+'/db', {encoding: 'json'});

net.createServer(function (con) {
  con.pipe(multilevel.server(db)).pipe(con);
}).listen(5005);

module.exports = db
