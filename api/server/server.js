var Eqi = require('eqi')
var eqstock = require('eqstock')

var server = Eqi.createServer()

server.extend(eqstock.session, {keys: ['key1', 'key2']})
server.extend(require('eqauth'), {key: 'user'})

module.exports = server
