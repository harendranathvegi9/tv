var db = require('./db/db.js')
var CJ = require('cron').CronJob

var spawn = require('child_process').spawn,

new CJ('0 */20 * * * *', function(){
  console.log('You will see this message every 20 minute');
  var py    = spawn('python', ['./trending-value/trendingvalue.py']);


  py.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  py.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  py.on('close', function (code) {
    console.log('child process exited with code ' + code);
  });
}, null, true);
