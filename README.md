# AssertThat BDD NPM client

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
  Options:
  -V, --version                         output the version number
  --projectId <ID>                      Jira project id
  --accessKey [ASSERTTHAT_ACCESS_KEY]   Access key
  --secretKey [ASSERTTHAT_SECRET_KEY]   Secret key
  --token [ASSERTTHAT_API_TOKEN]        Jira API token (for DataCenter only) as an alternative to accessKey/secretKey basic auth
  --jiraServerUrl [URL]                 Jira server URL e.g https://mycompanyjira.com
  --features                            Download features
  --report                              Upload report
  --jsonReportFolder [FOLDER PATH]      Cucumber json files folder
  --mode <mode>                         Features to download (default: "automated")
  --tags <tag-expression>               Cucumber tag expression for filtering scenarios (default: "")
  --runName [NAME]                      Test run name
  --metadata [FILE PATH]                Metadata json file path
  --outputFolder [FOLDER PATH]          Jira project id
  --jql [JQL]                           JQL filter for features download and report upload
  --jsonReportIncludePattern [PATTERN]  Pattern for json file names
  --proxyHost [Host]                    Proxy Host
  --proxyPort [Port]                    Proxy Port
  --numbered [true|false]               Append number to feature name on download
  -h, --help                            output usage information

```

Mandatory parameters are --projectId, --accessKey, --secretKey (if --accessKey or --secretKey is missing the plugin will attempt to read them from ASSERTTHAT_ACCESS_KEY and ASSERTTHAT_SECRET_KEY environment variables respectively.

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

Using Basic auth

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

Using Jira API token (more info can be found here [Using personal access tokens](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html))

```js
const assertThat = require('assertthat-bdd');

assertThat.downloadFeatures({
  "projectId": PROJECT_ID,
  "token": "ASSERTTHAT_API_TOKEN",
  "jiraServerUrl": "Jira server URL." //Omit if using Jira Cloud
}, function() {
  // some optional callback code
});
```

Available parameters:

```
  --accessKey [ASSERTTHAT_ACCESS_KEY]   Access key
  --secretKey [ASSERTTHAT_SECRET_KEY]   Secret key
  --token [ASSERTTHAT_API_TOKEN]        Jira API token (for DataCenter only) as an alternative to accessKey/secretKey basic auth
  --jiraServerUrl [URL]                 Jira server URL e.g https://mycompanyjira.com
  --projectId <ID>                      Jira project id
  --mode <mode>                         Features to download (default: "automated")
  --tags <tag-expression>               Cucumber tag expression for scenarios filtering
  --outputFolder [FOLDER PATH]          Jira project id
  --jql [JQL]                           JQL filter for features
  --numbered [true|false]               Append number to feature name on download
  --proxyHost [Host]                    Proxy Host
  --proxyPort [Port]                    Proxy Port
```

* For uploading reports:

Using Basic auth

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

Using Jira API token (more info can be found here [Using personal access tokens](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html))

```js
const assertThat = require('assertthat-bdd');

assertThat.uploadReports({
  "projectId": PROJECT_ID,
  "token": "ASSERTTHAT_API_TOKEN",
  "jiraServerUrl": "Jira server URL." //Omit if using Jira Cloud
}, function() {
   // some optional callback code
});
```

Available parameters:

```
  --accessKey [ASSERTTHAT_ACCESS_KEY]   Access key
  --secretKey [ASSERTTHAT_SECRET_KEY]   Secret key
  --token [ASSERTTHAT_API_TOKEN]        Jira API token (Server and DC only)
  --projectId <ID>                      Jira project id
  --jsonReportFolder [FOLDER PATH]      Cucumber json files folder
  --runName [NAME]                      Test run name
  --jsonReportIncludePattern [PATTERN]  Pattern for json file names
  --jql [JQL]                           JQL filter for Jira issues to update with test results
  --proxyHost [Host]                    Proxy Host
  --proxyPort [Port]                    Proxy Port
  --metadata [FILE PATH]                Metadata json file path
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
