var db = require('../../db/db.js')
var _ = require('lodash')

exports.route = function(plugin, ops, next){

  plugin.route({
    path: '/',
    handler: listing
  })

  plugin.route({
    path: '/snapshot/:id',
    handler: snapshot
  })
  next()
}

function listing (request, reply){
  getStreamArray(db, {start: 'imports~', end: 'imports~~'}, function(results){
    reply(JSON.stringify({snapshots: results}))
  })
}

function snapshot (request, reply){
  console.log('params', request.route.params)
  var id = request.route.params.id
  getStreamArray(db, {start: 'data~'+id+'~', end: 'data~'+id+'~~'}, function(results){
    var data = {data: [], headers:{}}
    var headers = _.map(Object.keys(results[0].value.ranks), function(value){return value + ' rank'}).concat(Object.keys(results[0].value.raw))
    headers.unshift('Ticker')
    data.headers = _.map(headers, function(header){
      return {title: header}
    })
    _.each(results, function(row){
      var r = row.value
      var ranks = _.map(_.values(r.ranks), function(item){return Math.round(item*100)/100})
      var raw = _.map(_.values(r.raw), function(item){return Math.round(item*100)/100})
      var d = [r.ticker].concat(ranks).concat(raw)
      data.data.push(d)
    })
    reply(JSON.stringify(data))
  })
}

function getStreamArray(db, ops, cb){
  var arr = []
  db.createReadStream(ops)
    .on('data', function (data) {
      arr.push(data)
    })
    .on('error', function (err) {
      console.log('Oh my!', err)
    })
    .on('close', function () {
      console.log('Stream closed')
    })
    .on('end', function () {
      console.log('Stream closed')
      cb(arr)
    })
}
