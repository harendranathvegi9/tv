var mapleTree = require('mapleTree')
router = new mapleTree.RouteTree({fifo: false})

$(document).ready(function(){
  $('body').on('click', 'a', function(e){
    route($(this).attr('href'))
    e.preventDefault()
  })
})

var Router = {}

Router.goto = function(uri){
  history.pushState(null, '', uri)
  var match = router.match(uri)
  if(typeof match.fn != 'undefined'){
    console.log('matcha', match)
    match.fn(match)
  }
  else fourofour()
}

Router.route = router.define

router.define('/', function(){
  console.log('TTTT')
})

Router.router = router

module.exports = Router

require('./snapshots.js')

function fourofour(){
  $('#main').html('404!')
}
