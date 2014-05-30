var db = require('./db/db.js')
var CJ = require('cron').CronJob
var argv = require('yargs').argv

var spawn = require('child_process').spawn

var interval = argv.interval || 'day'
var immediate = argv.immediate || false

var cront = '0 0 0 * * *'
if(interval == 'hour'){
  cront = '0 0 * * * *'
}
if(interval == 'minute'){
  cront = '0 * * * * *'
}

new CJ(cront, runPy, null, true);

if(immediate) runPy()

function runPy(){
  console.log('Running', cront);
  var args = ['../tv-import/trendingvalue.py']
  if(argv.dev) args.push('--dev')
  if(argv.output) args.push('--output='+argv.output)

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
}
