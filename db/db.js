var level = require('level')

var db = level(__dirname+'/db', {encoding: 'json'})

module.exports = db
