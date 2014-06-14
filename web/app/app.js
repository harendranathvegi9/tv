var _ = require('lodash')
var moment = require('moment')

var router = require('./router.js')
var host = 'http://'+location.hostname

router.router.define('/', function () {
 console.log('home232423')
  $.get(host+':5000/', function(data){
    var data = JSON.parse(data)
    var snapshotIds = _.pluck(data.snapshots, 'value')
    var $html = $('<div id="snapshots">')
    _.each(snapshotIds, function(id){
      var date = moment(id).format("MMMM Do YYYY, hh:mm:ss")
      var linkCSV = $('<a>').addClass('button').attr('href', 'snapshot/'+id+'/csv').text('CSV')
      var linkWeb = $('<a>').addClass('button').attr('href', 'snapshot/'+id).text('Table')
      var linkMom = $('<a>').addClass('button').attr('href', 'snapshot/'+id+'/momentum').text('Momentum')
      var $line = $('<div>').append(date).append(linkCSV).append(linkWeb).append(linkMom)

      $html.append($line)
    })
    $('#main').append($html)
  })
 this.next(match)
})

router.router.define('/snapshot/:id', function (match) {
  if(match.perfect){
    var id = match.params.id
    $.get(host+':5000/snapshot/'+id, function(data){
      var data = JSON.parse(data)
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

   $.get(host+':5000/snapshot/'+id, function(data){
     var data = JSON.parse(data)
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
      table.order(8, 'desc').draw()
   })
 }
 this.next(match)
})

function sortKey(key, modifier){
  return function(a, b){
    var res = 0
    modifier = modifier || 1
    if(a[key] < b[key]) res = -1
    if(a[key] > b[key]) res = 1
    return res*modifier
  }
}

$(document).ready(function(){
  bootstrap()
})

function bootstrap(){
  router.goto(window.location.pathname)
}
