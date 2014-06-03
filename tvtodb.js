var db = require('./db/db.js')
var peek = require('level-peek')
var fs = require('fs')

var binaryCSV = require('binary-csv')
var parser = binaryCSV({json: true})

module.exports = function(){
  // peek.last(db, {end: 'imports~~'}, function(err, key, value){
  //   var last = key.split('~')[1]
  //
  // })

  fs.readdir('./snapshots', function(err, files){
    files.map(function(name){
      var parts = name.split('.')
      if(parts.length < 2 || parts[1] != 'csv'){
        console.log('not csv, skipping')
      }
      else saveCSV(name)
    })
  })
}

function saveCSV(name){
  console.log('saving')
  var time = name.split('--')[1]*1000
  fs.createReadStream('./snapshots/'+name).pipe(parser)
    .on('data', function(line) {
      var metrics = {
        ticker: line.Ticker,
        name: line.Company,
        cap: line.MarketCap,
        PE: line.PE,
        PB: line.PB,
        PFCF: line.PFreeCashFlow,
        PS: line.PS,
        EVEBITDA: line.EVEBITDA,
        SHY: line.SHY
      }
      db.put('data~'+time+'~'+line.Ticker, metrics, function(err){
        if(err) throw err
      })
    })
    .on('close', function(){
      db.put('imports~'+time, time, function(err){
        if(err) throw err
      })
    })
}

module.exports.read = function(){
  peek.last(db, {end: 'imports~~'}, function(err, key, value){
    console.log('last import', value)
    db.createReadStream({start: 'data~'+value, end: 'data~'+value+'~'})
      .on('data', function (data) {
        console.log(data.key, '=', data.value)
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        console.log('Stream closed')
      })
  })

}
