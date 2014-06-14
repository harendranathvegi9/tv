var level = require('level-browserify')

var db = level('./snapshots', {valueEncoding: 'json'})

var cache = function(){}


cache.prototype.setSnapshot = function(id, data, cb){
  db.put('data~'+id, data, function(err){
    if(err){console.log('CACHE ERR'); if(cb){cb('Boo')}}
    else if(cb){cb(null)}
  })
}

cache.prototype.getSnapshot = function(id, cb){
  db.get('data~'+id, function(err, data){
    if(err) {console.log('ERR', err); cb(null)}
    if(cb) console.log('FROM CACHE'); cb(null, data)
  })
}

module.exports = new cache()
