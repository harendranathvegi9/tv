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
      var linkCSV = $('<a>').attr('href', 'snapshot/'+id+'/csv').text('CSV')
      var linkWeb = $('<a>').attr('href', 'snapshot/'+id).text('Table')
      var $line = $('<div>').append(date).append(linkCSV).append(linkWeb)

      $html.append($line)
    })
    $('#main').append($html)
  })
 this.next()
})

router.router.define('/snapshot/:id', function (match) {
 console.log('home')
 console.log('match', match)
 var id = match.params.id
 $.get(host+':5000/snapshot/'+id, function(data){
   var data = JSON.parse(data)
   console.log('data', data.data)
   console.log('headers', data.headers)
   $('#main').html('<table id="table">')
   $('#table').dataTable( {
        "pageLength": 10000,
        "bPaginate": false,
        "data": data.data,
        "columns": data.headers
    } );
 })
 this.next()
})

$(document).ready(function(){
  bootstrap()
})

function bootstrap(){
  router.goto(window.location.pathname)
}
