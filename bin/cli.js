'use strict'
var program = require('commander');
var assertThat = require('../lib/assertthat-bdd');
var colors = require('colors');

program
  .version('1.0.0')
  .option('-a, --accessKey [ASSERTTHAT_ACCESS_KEY]', 'Access key')
  .option('-s, --secretKey [ASSERTTHAT_SECRET_KEY]', 'Secret key')
  .option('-f, --features', 'Download features')
  .option('-r, --report', 'Upload report')
  .option('-i, --projectId <ID>', 'Jira project id')
  .option('-j, --jsonReportFolder [FOLDER PATH]', 'Cucumber json files folder')
  .option('-m, --mode <mode>', 'Features to download', /^(automated|manual|both)$/i, 'automated')
  .option('-n, --runName [NAME]', 'Test run name')
  .option('-o, --outputFolder [FOLDER PATH]', 'Jira project id')
  .option('-q, --jql [JQL]', 'JQL filter for features')
  .option('-t, --jsonReportIncludePattern [PATTERN]', 'Pattern for json file names')
  .option('-x, --proxyURI [URI]', 'Proxy URI');

program.on('--help', function(){
  console.log('')
  console.log('Examples:');
  console.log('  $ assertthat-bdd -f -i 10001 -a "access_key" -s "secret_key"');
  console.log('  $ assertthat-bdd -r -i 10001 -a "access_key" -s "secret_key"');
  console.log('  $ assertthat-bdd -h');
});

program.parse(process.argv);

var dateFormat = require('dateformat');
var now = new Date();


var settings = {
    projectId: program.projectId,
    accessKey: program.accessKey || process.env.ASSERTTHAT_ACCESS_KEY,
    secretKey: program.secretKey || process.env.ASSERTTHAT_SECRET_KEY,
    jsonReportFolder: program.jsonReportFolder || './reports/',
    mode: program.mode,
    runName: program.runName || 'Test run ' + dateFormat(now, "dd mmm yyyy HH:mm:ss"),
    outputFolder: program.outputFolder || './features/',
    jql: program.jql,
    jsonReportIncludePattern: program.jsonReportIncludePattern,
    proxyURI: program.proxyURI || process.env.http_proxy,

};

function make_red(txt) {
  return colors.red(txt); //display the help text in red on the console
}

if(program.features){
    if(!program.projectId || !settings.accessKey || !settings.secretKey){
        if(!program.projectId){
            console.log('');
            console.log(make_red('projectId (-i) option is required'));
            console.log('');
        }
        if(!program.accessKey){
            console.log('');
            console.log(make_red('accessKey (-a) option is required'));
            console.log('');
        }
        if(!program.secretKey){
            console.log('');
            console.log(make_red('secretKey (-s) option is required'));
            console.log('');
        }
        program.outputHelp(make_red);
    }else{
        assertThat.downloadFeatures(settings);
    }
}

if(program.report){
if(!program.projectId || !settings.accessKey || !settings.secretKey){
        if(!program.projectId){
            console.log('');
            console.log(make_red('projectId (-i) option is required'));
            console.log('');
        }
        if(!program.accessKey){
            console.log('');
            console.log(make_red('accessKey (-a) option is required'));
            console.log('');
        }
        if(!program.secretKey){
            console.log('');
            console.log(make_red('secretKey (-s) option is required'));
            console.log('');
        }
        program.outputHelp(make_red);
    }else{
        assertThat.uploadReports(settings);
    }
}