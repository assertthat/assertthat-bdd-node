#!/usr/bin/env node
'use strict'
const program = require('commander');
const assertThat = require('../lib/assertthat-bdd');
const colors = require('colors');
const dateFormat = require('dateformat');

program
  .version('1.2.0')
  .option('--accessKey [ASSERTTHAT_ACCESS_KEY]', 'Access key')
  .option('--secretKey [ASSERTTHAT_SECRET_KEY]', 'Secret key')
  .option('--token [ASSERTTHAT_API_TOKEN]', 'Jira API token (Server and DC only)')
  .option('--jiraServerUrl [URL]', 'Jira server URL e.g https://mycompanyjira.com')
  .option('--features', 'Download features')
  .option('--report', 'Upload report')
  .option('--projectId <ID>', 'Jira project id')
  .option('--jsonReportFolder [FOLDER PATH]', 'Cucumber json files folder')
  .option('--mode <mode>', 'Features to download', /^(automated|manual|both)$/i, 'automated')
  .option('--tags <tag-expression>', 'Cucumber tag expression for filtering scenarios', '')
  .option('--runName [NAME]', 'Test run name')
  .option('--metadata [FILE PATH]', 'Metadata json file path')
  .option('--outputFolder [FOLDER PATH]', 'Jira project id')
  .option('--jql [JQL]', 'JQL filter for features download and report upload')
  .option('--jsonReportIncludePattern [PATTERN]', 'Pattern for json file names')
  .option('--proxyHost [Host]', 'Proxy Host')
  .option('--proxyPort [Port]', 'Proxy Port')
  .option('--numbered [true|false]', 'Append number to feature name on download');

program.on('--help', function(){
  console.log('')
  console.log('Examples:');
  console.log('  $ assertthat-bdd --features --projectId 10001 --accessKey "access_key" --secretKey "secret_key"');
  console.log('  $ assertthat-bdd --features --projectId 10001 --token JIRA_API_TOKEN');
  console.log('  $ assertthat-bdd --report --projectId 10001 --accessKey "access_key" --secretKey "secret_key"');
  console.log('  $ assertthat-bdd --report --projectId 10001 --token JIRA_API_TOKEN');
  console.log('  $ assertthat-bdd -h');
});

program.parse(process.argv);

const settings = {
    projectId: program.projectId || process.env.ASSERTTHAT_PROJECT_ID,
    accessKey: program.accessKey || process.env.ASSERTTHAT_ACCESS_KEY,
    secretKey: program.secretKey || process.env.ASSERTTHAT_SECRET_KEY,
    token: program.token || process.env.ASSERTTHAT_API_TOKEN,
    jiraServerUrl: program.jiraServerUrl,
    jsonReportFolder: program.jsonReportFolder || './reports/',
    mode: program.mode,
    numbered: program.numbered,
    metadata: program.metadata || '',
    runName: program.runName || 'Test run ' + dateFormat(new Date(), "dd mmm yyyy HH:mm:ss"),
    outputFolder: program.outputFolder || './features/',
    jql: program.jql || '',
    tags: program.tags || '',
    jsonReportIncludePattern: program.jsonReportIncludePattern || '.+.json',
    proxyHost: program.proxyHost,
    proxyPort: program.proxyPort,
};

function make_red(txt) {
  return colors.red(txt); //display the help text in red on the console
}

if(program.features){
    if(!settings.projectId || (!settings.token && (!settings.accessKey || !settings.secretKey))){
        if(!program.projectId){
            console.log('');
            console.log(make_red('--projectId option is required'));
            console.log('');
        }
        if(!settings.token && (!settings.accessKey || !settings.secretKey)){
            console.log('');
            console.log(make_red('--accessKey with --secretKey or Jira API --token option is required'));
            console.log('');
        }
        program.outputHelp(make_red);
    }else{
        assertThat.downloadFeatures(settings);
    }
}

if(program.report){
if(!settings.projectId || (!settings.token && (!settings.accessKey || !settings.secretKey))){
        if(!program.projectId){
            console.log('');
            console.log(make_red('projectId (-i) option is required'));
            console.log('');
        }
        if(!settings.token && (!settings.accessKey || !settings.secretKey)){
            console.log('');
            console.log(make_red('accessKey (-a) with secretKey (-s) or Jira API token (-t) option is required'));
            console.log('');
        }
        program.outputHelp(make_red);
    }else{
        assertThat.uploadReports(settings);
    }
}
