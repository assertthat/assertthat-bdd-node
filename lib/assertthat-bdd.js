#!/usr/bin/env node
'use strict'

const admZip = require('adm-zip');
const request = require('superagent');
require('superagent-proxy')(request);
const fs = require('fs');
const path = require('path')

const downloadFeatures = function(settings, callback) {
    let featuresUrl = "https://bdd.assertthat.app/rest/api/1/project/" + settings.projectId + "/features"
    if(settings.jiraServerUrl){
        featuresUrl = settings.jiraServerUrl+"/rest/assertthat/latest/project/"+settings.projectId+"/client/features"
    }
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
      if(settings.tags){
        req.query({ tags: settings.tags })
     }
    
      req.query({ numbered: settings.numbered })
     
      if(settings.token){
        req.set({'Authorization': 'Bearer ' + settings.token})
      }else{
        req.auth(settings.accessKey, settings.secretKey);
      }

      req.on('error', function(error) {
        console.log(error);
      })
      .on('response', function(response) {
        if (response.status !== 200) {
            console.log("Failed to download feature files: " + response.error);
            req.abort();
        }
      })
      .pipe(fs.createWriteStream(settings.outputFolder+'/features.zip'))
      .on('finish', function() {
        const files=fs.readdirSync(settings.outputFolder);
        for(let i=0;i<files.length;i++){
            let filename=path.join(settings.outputFolder,files[i]);
            if (filename.indexOf('.feature')>=0) {
                fs.unlinkSync(filename);
            }
        }
        const zip = new admZip(settings.outputFolder+'/features.zip');
        zip.extractAllTo( settings.outputFolder, true);
        fs.unlinkSync(settings.outputFolder+'/features.zip');
        if(callback) callback();
      });
};

const uploadReports = async function(settings, callback) {
    const files = fs.readdirSync(settings.jsonReportFolder);
    let jsonReportIncludePattern = ".+.json"
    if(settings.jsonReportIncludePattern){
      jsonReportIncludePattern = settings.jsonReportIncludePattern;
    }
    console.log('Using ' + jsonReportIncludePattern + ' when searching for cucumber.json files');
    let runId = -1;
    for(let i=0;i<files.length;i++){
        let filename=path.join(settings.jsonReportFolder,files[i]);
        if (filename.indexOf('.json')>=0 && new RegExp(jsonReportIncludePattern, 'gi').test(files[i])) {
          console.log('Sending file ' + filename + ' with runId ' + runId);
          const res = sendReport(settings,filename,runId);
          await res.then(res => { runId=JSON.parse(res.text).runId});
        }
    }
    
    if(callback) callback();
};

async function sendReport(settings, filename, runId){
    let reportUrl = "https://bdd.assertthat.app/rest/api/1/project/" + settings.projectId + "/report"
    if(settings.jiraServerUrl){
        reportUrl = settings.jiraServerUrl+"/rest/assertthat/latest/project/"+settings.projectId+"/client/report"
    }
    const req =  request.post(reportUrl)
    
    if(settings.proxyURI){
        req.proxy(settings.proxyURI)
    }
    let metadata = '';
    if (fs.existsSync(settings.metadata)){
       metadata = fs.readFileSync(settings.metadata, 'utf8');
    }
    if(settings.token){
      req.set({'Authorization': 'Bearer ' + settings.token})
    }else{
      req.auth(settings.accessKey, settings.secretKey);
    }
    const response = req
        .set('Content-Type', 'application/octet-stream')
        .field('projectId', settings.projectId)
        .field('runName', settings.runName)
        .field('metadata', metadata)
        .field('runId', runId)
        .field('jql', settings.jql)
        .attach('file', filename)
    return response;
};

module.exports = {
    downloadFeatures: downloadFeatures,
    uploadReports: uploadReports
};
