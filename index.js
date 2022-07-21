'use strict'

const assertThat = require('./lib/assertthat-bdd');
const _ = require('underscore');
const dateFormat = require('dateformat');

const defaults = {
    accessKey: process.env.ASSERTTHAT_ACCESS_KEY,
    secretKey: process.env.ASSERTTHAT_SECRET_KEY,
    jsonReportFolder: './reports/',
    mode: 'automated',
    runName: 'Test run ' + dateFormat(Date.now(), "dd mmm yyyy HH:mm:ss"),
    outputFolder: './features/',
    proxyURI:  process.env.http_proxy,

};

function checkArgs(settings){
     _.defaults(settings, defaults);
    if(!settings.projectId){
        console.log(settings);
        throw new Error('projectId setting is required');
    }
    if(!settings.accessKey){
        console.log(settings);
        throw new Error('accessKey setting is required');
    }
    if(!settings.secretKey){
        console.log(settings);
        throw new Error('secretKey setting is required');
    }
    return settings;
}

module.exports = {
    downloadFeatures:  function(settings, callback) {
        settings = checkArgs(settings);
        assertThat.downloadFeatures(settings, callback);
    },
    uploadReports: function(settings, callback) {
        settings = checkArgs(settings);
        assertThat.uploadReports(settings, callback);
    }
}