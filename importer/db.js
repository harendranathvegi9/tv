var multilevel = require('multilevel');
var net = require('net');

var db = multilevel.client();
var con = net.connect(5005);
con.pipe(db.createRpcStream()).pipe(con);

module.exports = db
