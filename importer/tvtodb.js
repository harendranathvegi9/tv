var db = require('./db.js')
var fs = require('fs')
var _ = require('lodash')

var ranker = require('rankarray')

var binaryCSV = require('binary-csv')
var parser = binaryCSV({json: true})

var csvWriter = require('csv-write-stream')

module.exports = function(){
  fs.readdir('../snapshots', function(err, files){
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
  console.log('saving', name)
  var time = name.split('--')[1]*1000
  console.log('time is', time)
  var idata = []
  fs.createReadStream('../snapshots/'+name).pipe(parser)
    .on('data', function(line) {
      var metrics = {
        ticker: line.Ticker,
        name: line.Company,
        cap: parseFloat(line.MarketCap),
        PE: parseFloat(line.PE),
        PB: parseFloat(line.PB),
        PFCF: parseFloat(line.PFreeCashFlow),
        PS: parseFloat(line.PS),
        EVEBITDA: parseFloat(line.EVEBITDA),
        SHY: parseFloat(line.SHY),
        MOM: parseFloat(line.PerformanceHalfYear)
      }
      // if(typeof parseFloat(line.PerformanceHalfYear) != 'number') console.log(line.PerformanceHalfYear, typeof parseFloat(line.PerformanceHalfYear))
      idata.push(metrics)
    })
    .on('end', function(){
      console.log('ENDED, renaming now', name)
      // fs.renameSync('../snapshots/'+name, '../snapshots/processed/'+name)
      saveRank(idata, time)
    })
}

function rank(idata){
  var length = idata.length - 1
  var ranks = {}
  var by = {
    PE: -1,
    PB: -1,
    PFCF: -1,
    PS: -1,
    EVEBITDA: -1,
    SHY: 1,
    MOM: 1
  }
  _.each(idata, function(row, index){
    if(!(row.PE>0)) row.PE = 9999999
    if(!(row.PB>0)) row.PB = 9999999
    if(!(row.PFCF>0)) row.PFCF = 9999999
    if(!(row.PS>0)) row.PS = 9999999
    if(!(row.EVEBITDA>0)) row.EVEBITDA = 9999999
    if(isNaN(row.SHY)) console.log('SHY NOT NUM')
    if(isNaN(row.MOM)) row.MOM = 0
  })
  _.each(by, function(dir, indi){
    // var sorted = idata.sort(sortProp(indi, dir))
    // sorted.forEach(function(value, index){
    //   ranks[value.ticker] = ranks[value.ticker] || {ranks:{}, raw:{}}
    //   ranks[value.ticker].ranks[indi] = 100*((index/length))
    //   ranks[value.ticker].raw[indi] = value[indi]
    // })
    // @TODO implement tied ranking
    var tiedrank = ranker(idata, indi, dir).tiedRank().normalize().value('merged')
    _.each(tiedrank, function(row){
      ranks[row.ticker] = ranks[row.ticker] || {ranks:{}, raw:{}}
      ranks[row.ticker].ranks[indi] = 100*row.rank
      ranks[row.ticker].raw[indi] = row[indi]
    })
  })
  var rankarr = []
  _.each(ranks, function(values, ticker){
    var sixranks = _.omit(values.ranks, 'MOM')
    var sumrank = _.reduce(sixranks, function(sum, num) {
      return sum + num
    })
    rankarr.push({ticker: ticker, rank: sumrank})
    ranks[ticker].ranks.rank = sumrank
  })
  var sorted = rankarr.sort(sortProp('rank'))
  _.each(sorted, function(row, index){
    ranks[row.ticker].ranks.rankNormal = index/length
    ranks[row.ticker].ticker = row.ticker
  })
  // console.log(sorted)
  return ranks
}

function saveRank(idata, time){
  var ranks = rank(idata)

  var writer = csvWriter()
  writer.pipe(fs.createWriteStream('../snapshots/output/ranked--'+time+'.csv'))

  var ws = db.createWriteStream()
  ws.on('error', function (err) {
    console.log('WS error', err)
  })
  ws.on('close', function () {
    console.log('WS Closed')
  })

  _.each(ranks, function(line, index){
    var a = {ticker: line.ticker}
    _.each(line.ranks, function(rank, key){a['rank-'+key] = rank})
    _.each(line.raw, function(rank, key){a['raw-'+key] = rank})
    writer.write(a)

    ws.write({ key: 'data~'+time+'~'+line.ticker, value: line })
  })
  writer.end()
  ws.end()

  db.put('imports~'+time, time, function(err){
    console.log('SAVED, run complete')
    if(err) {
      console.log('error:', time)
      throw err
    }
  })
}

function sortProp(prop, modifier){
  return function(a, b){
    var res = 0
    modifier = modifier || 1
    if(a[prop] < b[prop]) res = -1
    if(a[prop] > b[prop]) res = 1
    return res*modifier
  }
}

_.reduce({a:1, b:2}, function(sum, num) {
  console.log('sm', sum, num)
  return sum + num
}, 0)
