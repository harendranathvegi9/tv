var CJ = require('cron').CronJob
var argv = require('yargs').argv

var tvToDB = require('tvtodb.js')
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
  var args = ['./trending-value/trendingvalue.py']
  if(argv.dev) args.push('--dev')
  args.push('--output=../../snapshots')

  console.log('calling python with args:', args)
  var py    = spawn('python', args);

  py.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  py.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  py.on('close', function (code)
    console.log('child process exited with code ' + code);
    console.log('running db import now')
    tvToDB()
  });
}
