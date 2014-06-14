var _ = require('lodash')
var moment = require('moment')

var router = require('./router.js')

var host = 'http://'+location.hostname

router.router.define('/', function (match) {
  $.get(host+':5000/', function(data){
    var data = JSON.parse(data)
    var snapshotIds = _.pluck(data.snapshots, 'value')
    var $html = $('<div id="snapshots">')
    _.each(snapshotIds, function(id){
      var date = moment(id).format("MMMM Do YYYY, hh:mm:ss")
      var linkCSV = $('<a>').addClass('button').attr('href', 'snapshot/'+id+'/csv').text('CSV')
      var linkWeb = $('<a>').addClass('button').attr('href', 'snapshot/'+id+'/all').text('Table')
      var linkMom = $('<a>').addClass('button').attr('href', 'snapshot/'+id+'/momentum').text('Momentum')
      var $line = $('<div>').append(date).append(linkCSV).append(linkWeb).append(linkMom)

      $html.append($line)
    })
    $('#main').append($html)
  })
 this.next(match)
})

$(document).ready(function(){
  bootstrap()
})

function bootstrap(){
  router.goto(window.location.pathname)
}
