[![Build Status](https://travis-ci.org/assertthat/assertthat-bdd-maven-plugin.svg?branch=master)](https://travis-ci.org/assertthat/assertthat-bdd-node)

# AssertThat BDD Node.js client

Node.js plugin for interaction with [AssertThat BDD Jira plugin](https://marketplace.atlassian.com/apps/1219033/assertthat-bdd-test-management-in-jira?hosting=cloud&tab=overview).

```
$ npm install @assertthat/assertthat-bdd -g
```

## Using from the command line

Documentation on how to obtain access/secret keys and project id can be found here [AssertThat+Configuration](https://assertthat.atlassian.net/wiki/spaces/ABTM/pages/725385217/AssertThat+Configuration)

Parameters can either be passed from the command line:

```
$ assertthat-bdd -i PROJECT_ID -a ASSERTTHAT_ACCESS_KEY -s ASSERTTHAT_SECRET_KEY -f (for downloading feature files) -r (for uploading reports)
```

Available parameters:
```
  -V, --version                             output the version number
  -a, --accessKey [ASSERTTHAT_ACCESS_KEY]   Access key
  -s, --secretKey [ASSERTTHAT_SECRET_KEY]   Secret key
  -f, --features                            Download features
  -r, --report                              Upload report
  -i, --projectId <ID>                      Jira project id
  -j, --jsonReportFolder [FOLDER PATH]      Cucumber json files folder
  -m, --mode <mode>                         Features to download (default: "automated")
  -n, --runName [NAME]                      Test run name
  -o, --outputFolder [FOLDER PATH]          Jira project id
  -q, --jql [JQL]                           JQL filter for features
  -t, --jsonReportIncludePattern [PATTERN]  Pattern for json file names
  -x, --proxyURI [URI]                      Proxy URI
  -h, --help                                output usage information

```

Mandatory parameters are -i, -a, -s (if -a or -s is missing the plugin will attempt to read them from ASSERTTHAT_ACCESS_KEY and ASSERTTHAT_SECRET_KEY environment variables respectively.

## Using from within a script

You can use the client in your own scripts to download feature files and upload reports to AssertThat BDD .

```
$ npm install @assertthat/assertthat-bdd --save
```

* #####For downloading feature files:

```
var assertThat = require('assertthat-bdd');

assertThat.downloadFeatures({
  "projectId": PROJECT_ID,
  "accessKey": "ASSERTTHAT_ACCESS_KEY",
  "secretKey": "ASSERTTHAT_SECRET_KEY"
}, function() {
  // some optional callback code
});
```

Available parameters:

```
  -a, --accessKey [ASSERTTHAT_ACCESS_KEY]   Access key
  -s, --secretKey [ASSERTTHAT_SECRET_KEY]   Secret key
  -i, --projectId <ID>                      Jira project id
  -m, --mode <mode>                         Features to download (default: "automated")
  -o, --outputFolder [FOLDER PATH]          Jira project id
  -q, --jql [JQL]                           JQL filter for features
  -x, --proxyURI [URI]                      Proxy URI
```

* #####For uploading reports:

```
var assertThat = require('assertthat-bdd');

assertThat.uploadReports({
  "projectId": PROJECT_ID,
  "accessKey": "ASSERTTHAT_ACCESS_KEY",
  "secretKey": "ASSERTTHAT_SECRET_KEY"
}, function() {
   // some optional callback code
});
```

Available parameters:

```
  -a, --accessKey [ASSERTTHAT_ACCESS_KEY]   Access key
  -s, --secretKey [ASSERTTHAT_SECRET_KEY]   Secret key
  -i, --projectId <ID>                      Jira project id
  -j, --jsonReportFolder [FOLDER PATH]      Cucumber json files folder
  -n, --runName [NAME]                      Test run name
  -t, --jsonReportIncludePattern [PATTERN]  Pattern for json file names
  -x, --proxyURI [URI]                      Proxy URI
```
