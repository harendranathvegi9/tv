var router = require('./router.js')
var Cache = require('./datacache.js')
var host = 'http://'+location.hostname


router.router.define('/snapshot/:id', function (match) {
  if(match.perfect){

    var id = match.params.id
    getSnapshot(id, function(err, data){
      $('#main').html('<table id="table">')
      $('#table').dataTable( {
          "pageLength": 10000,
          "bPaginate": false,
          "data": data.data,
          "columns": data.headers
      } );
    })

  }
  this.next(match)
})

router.router.define('/snapshot/:id/momentum/:percent?', function (match) {
  if(match.perfect){

    var percent = match.params.percent ? parseFloat(match.params.percent)/100 : .1
    var id = match.params.id

    getSnapshot(id, function(err, data){
     var rows = data.data.sort(sortKey(8, -1))
     var cut = parseInt(rows.length*percent)
     console.log(rows.length, cut)
     rows = rows.splice(0, cut)
     console.log(rows)


     $('#main').html('<table id="table">')
     var table = $('#table').dataTable( {
          "pageLength": 10000,
          "bPaginate": false,
          "data": rows,
          "columns": data.headers
      } ).api()
      table.order(7, 'desc').draw()
   })
 }
 this.next(match)
})

function getSnapshot(id, cb){
  Cache.getSnapshot(id, function(err, data){
    if(!data){
      console.log('QUERYING API')
      $.get(host+':5000/snapshot/'+id, function(data){
        var data = JSON.parse(data)
        Cache.setSnapshot(id, data)
        cb(null, data)
      })
    }
    else{
      cb(null, data)
    }
  })

}
function sortKey(key, modifier){
  return function(a, b){
    var res = 0
    modifier = modifier || 1
    if(a[key] < b[key]) res = -1
    if(a[key] > b[key]) res = 1
    return res*modifier
  }
}
