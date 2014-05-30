var db = require('./db/db.js')
var CJ = require('cron').CronJob
var argv = require('yargs').argv

console.log(argv)
var dev = argv.dev ? true : false

var spawn = require('child_process').spawn

new CJ('0 */20 * * * *', function(){
  console.log('You will see this message every 20 minute');
  var args = ['../tv-import/trendingvalue.py']
  if(argv.dev) args.push('--dev')
  if(argv.output) args.push('--output Z'+argv.output)

  console.log('calling python with args:', args)
  var py    = spawn('python', args);

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
