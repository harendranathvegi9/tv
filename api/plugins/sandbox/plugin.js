
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
  reply('hi')
}

function snapshot (request, reply){
  reply('hi')
}
