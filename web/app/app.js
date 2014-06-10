var router = require('./router.js')

router.router.define('/', function () {
 console.log('home')
  $.get('http://localhost:5000/', function(data){
    var data = JSON.parse(data)
    console.log(data.snapshots)
    console.log(JSON.stringify(data, null, 2))
    $('#main').html('<pre>'+JSON.stringify(data, null, 2)+'</pre>')
  })
 this.next()
})

router.router.define('/snapshot/:id', function (match) {
 console.log('home')
 console.log('match', match)
 var id = match.params.id
 $.get('http://localhost:5000/snapshot/'+id, function(data){
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
