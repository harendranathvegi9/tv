var level = require('level')

var db = level('./db', {encoding: 'json'})

module.exports = db
