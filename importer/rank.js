var data = [
  {cap: 1},
  {cap:10},
  {cap:10},
  {cap:10},
  {cap:11},
  {cap:12}
]

var Rank = require('rankarray')
console.log('rank normal', Rank(data, 'cap').rank().normalize().value())
console.log('data', data, Rank)
console.log('rank tied', Rank(data, 'cap').tiedRank().normalize().value())
console.log('rank tied merge', Rank(data, 'cap').tiedRank().normalize().value('merged'))
