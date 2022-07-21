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
  -u, --jiraServerUrl [URL]                 Jira server URL e.g https://mycompanyjira.com
  -f, --features                            Download features
  -r, --report                              Upload report
  -i, --projectId <ID>                      Jira project id
  -j, --jsonReportFolder [FOLDER PATH]      Cucumber json files folder
  -m, --mode <mode>                         Features to download (default: "automated")
  -l, --tags <tag-expression>               Cucucmber tag expression for scenarios filtering
  -n, --runName [NAME]                      Test run name
  -d, --metadata [FILE PATH]                Metadata json file path
  -o, --outputFolder [FOLDER PATH]          Features output folder
  -q, --jql [JQL]                           JQL filter for features download or Jira issues to update with test results
  -t, --jsonReportIncludePattern [PATTERN]  Pattern for json file names
  -x, --proxyURI [URI]                      Proxy URI
  -b, --numbered [true|false]               Append number to feature name on download
  -h, --help                                output usage information

```

Mandatory parameters are -i, -a, -s (if -a or -s is missing the plugin will attempt to read them from ASSERTTHAT_ACCESS_KEY and ASSERTTHAT_SECRET_KEY environment variables respectively.

## Using from within a script

You can use the client in your own scripts to download feature files and upload reports to AssertThat BDD .

```
$ npm install @assertthat/assertthat-bdd --save
```
### Typescript usage
```ts
import * as assertThat from '@assertthat/assertthat-bdd'
```

* For downloading feature files:

```js
const assertThat = require('assertthat-bdd');

assertThat.downloadFeatures({
  "projectId": PROJECT_ID,
  "accessKey": "ASSERTTHAT_ACCESS_KEY",
  "secretKey": "ASSERTTHAT_SECRET_KEY",
  "jiraServerUrl": "Jira server URL." //Omit if using Jira Cloud
}, function() {
  // some optional callback code
});
```

Available parameters:

```
  -a, --accessKey [ASSERTTHAT_ACCESS_KEY]   Access key
  -s, --secretKey [ASSERTTHAT_SECRET_KEY]   Secret key
  -u, --jiraServerUrl [URL]                 Jira server URL e.g https://mycompanyjira.com
  -i, --projectId <ID>                      Jira project id
  -m, --mode <mode>                         Features to download (default: "automated")
  -l, --tags <tag-expression>               Cucucmber tag expression for scenarios filtering
  -o, --outputFolder [FOLDER PATH]          Jira project id
  -q, --jql [JQL]                           JQL filter for features
  -b, --numbered [true|false]               Append number to feature name on download
  -x, --proxyURI [URI]                      Proxy URI
```

* For uploading reports:

```js
const assertThat = require('assertthat-bdd');

assertThat.uploadReports({
  "projectId": PROJECT_ID,
  "accessKey": "ASSERTTHAT_ACCESS_KEY",
  "secretKey": "ASSERTTHAT_SECRET_KEY",
  "jiraServerUrl": "Jira server URL." //Omit if using Jira Cloud
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
  -q, --jql [JQL]                           JQL filter for Jira issues to update with test results
  -x, --proxyURI [URI]                      Proxy URI
  -d, --metadata [FILE PATH]                Metadata json file path
```

* Metadata file path is the path to a  simple json file (no nesting) with some additional data about the run that can be optionally supplied. 

Example of the file can be: 

```json
{
  "environment": "UAT-1",
  "build": "XX-1-YY"
}
```

### Example project 

Refer to example project [assertthat-testcafe-demo](https://github.com/assertthat/assertthat-testcafe-demo)
