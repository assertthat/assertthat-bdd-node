#!/usr/bin/env node
'use strict'

const admZip = require('adm-zip');
const request = require('superagent');
require('superagent-proxy')(request);
const fs = require('fs');
var path = require('path')

var downloadFeatures = function(settings, callback) {
    const featuresUrl = "https://bdd.assertthat.com/rest/api/1/project/" + settings.projectId + "/features"
    if (!fs.existsSync(settings.outputFolder)){
        fs.mkdirSync(settings.outputFolder);
    }
    const req = request.get(featuresUrl)
      if(settings.proxyURI){
         req.proxy(settings.proxyURI)
      }
      if(settings.jql){
         req.query({ jql: settings.jql })
      }

      if(settings.mode){
         req.query({ mode: settings.mode })
      }
      req.auth(settings.accessKey, settings.secretKey)
      .on('error', function(error) {
        console.log(error);
      })
      .on('response', function(response) {
        if (response.status !== 200) {
            console.log("Failed to download feature files: " + response.text);
            req.abort();
        }
      })
      .pipe(fs.createWriteStream(settings.outputFolder+'/features.zip'))
      .on('finish', function() {
        var files=fs.readdirSync(settings.outputFolder);
        for(var i=0;i<files.length;i++){
            var filename=path.join(settings.outputFolder,files[i]);
            if (filename.indexOf('.feature')>=0) {
                fs.unlinkSync(filename);
            }
        }
        var zip = new admZip(settings.outputFolder+'/features.zip');
        zip.extractAllTo( settings.outputFolder, true);
        fs.unlinkSync(settings.outputFolder+'/features.zip');
      });
};

var uploadReports = async function(settings, callback) {
    var files = fs.readdirSync(settings.jsonReportFolder);
    var runId = -1;
    for(var i=0;i<files.length;i++){
        var filename=path.join(settings.jsonReportFolder,files[i]);
        if (filename.indexOf('.json')>=0) {
            console.log('sending file ' + filename + ' with runId ' + runId);
           var res = sendReport(settings,filename,runId);
           await res.then(res => { runId=JSON.parse(res.text).runId});

        }
    }

};

async function sendReport(settings, filename, runId){
    const reportUrl = "https://bdd.assertthat.com/rest/api/1/project/" + settings.projectId + "/report"
    const req =  request.post(reportUrl)
    var newRunId = runId;
    if(settings.proxyURI){
        req.proxy(settings.proxyURI)
    }
    var metadata = '';
    if (fs.existsSync(settings.metadata)){
       metadata = fs.readFileSync(settings.metadata, 'utf8');
    }
    const response = req
        .auth(settings.accessKey, settings.secretKey)
        .set('Content-Type', 'application/octet-stream')
        .field('projectId', settings.projectId)
        .field('runName', settings.runName)
        .field('metadata', metadata)
        .field('runId', runId)
        .attach('file', filename)
    return response;
};

module.exports = {
    downloadFeatures: downloadFeatures,
    uploadReports: uploadReports
};