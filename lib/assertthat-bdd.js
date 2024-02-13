#!/usr/bin/env node
'use strict';

const admZip = require('adm-zip');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const downloadFeatures = function (settings, callback) {
    let featuresUrl = "https://bdd.assertthat.app/rest/api/1/project/" + settings.projectId + "/features";
    if (settings.jiraServerUrl) {
        featuresUrl = settings.jiraServerUrl + "/rest/assertthat/latest/project/" + settings.projectId + "/client/features";
    }
    if (!fs.existsSync(settings.outputFolder)) {
        fs.mkdirSync(settings.outputFolder);
    }

    axios.get(featuresUrl, {
        params: {
            jql: settings.jql,
            mode: settings.mode,
            tags: settings.tags,
            numbered: settings.numbered
        },
        proxy: settings.proxyHost ? {
            protocol: 'http',
            host: settings.proxyHost,
            port: settings.proxyPort
        } : undefined,
        headers: settings.token ? {
            'Authorization': 'Bearer ' + settings.token
        } : undefined,
        auth: settings.token ? undefined : {
            username: settings.accessKey,
            password: settings.secretKey
        },
        responseType: 'stream'
    })
    .then(response => {
        if (response.status !== 200) {
            console.log("Failed to download feature files: " + response.statusText);
            return;
        }
        const filePath = path.join(settings.outputFolder, 'features.zip');
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on('finish', () => {
            writer.close();
            const files = fs.readdirSync(settings.outputFolder);
            for (let i = 0; i < files.length; i++) {
                let filename = path.join(settings.outputFolder, files[i]);
                if (filename.indexOf('.feature') >= 0) {
                    fs.unlinkSync(filename);
                }
            }
            const zip = new admZip(filePath);
            zip.extractAllTo(settings.outputFolder, true);
            fs.unlinkSync(filePath);
            if (callback) callback();
        });
    })
    .catch(error => {
        console.log(error);
    });
};

const uploadReports = async function (settings, callback) {
    const files = fs.readdirSync(settings.jsonReportFolder);
    let jsonReportIncludePattern = ".+.json";
    if (settings.jsonReportIncludePattern) {
        jsonReportIncludePattern = settings.jsonReportIncludePattern;
    }
    console.log('Using ' + jsonReportIncludePattern + ' when searching for cucumber.json files');
    let runId = -1;
    for (let i = 0; i < files.length; i++) {
        let filename = path.join(settings.jsonReportFolder, files[i]);
        if (filename.indexOf('.json') >= 0 && new RegExp(jsonReportIncludePattern, 'gi').test(files[i])) {
            console.log('Sending file ' + filename + ' with runId ' + runId);
            try {
                const res = await sendReport(settings, filename, runId);
                runId = res.data.runId;
            } catch (error) {
                console.log(error);
            }
        }
    }

    if (callback) callback();
};

const FormData = require('form-data');

async function sendReport(settings, filename, runId) {
    let reportUrl = "https://bdd.assertthat.app/rest/api/1/project/" + settings.projectId + "/report";
    if (settings.jiraServerUrl) {
        reportUrl = settings.jiraServerUrl + "/rest/assertthat/latest/project/" + settings.projectId + "/client/report";
    }

    let metadata = '';
    if (fs.existsSync(settings.metadata)) {
        metadata = fs.readFileSync(settings.metadata, 'utf8');
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filename));
    formData.append('projectId', settings.projectId);
    formData.append('runName', settings.runName);
    formData.append('metadata', metadata);
    formData.append('runId', runId);
    formData.append('jql', settings.jql);

    try {
        const response = await axios.post(reportUrl, formData, {
            headers: {
                ...formData.getHeaders(),
                ...settings.token ? { 'Authorization': 'Bearer ' + settings.token } : {}
            },
            proxy: settings.proxyHost ? {
                protocol: 'http',
                host: settings.proxyHost,
                port: settings.proxyPort
            } : undefined,
            auth: settings.token ? undefined : {
                username: settings.accessKey,
                password: settings.secretKey
            }
        });
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


module.exports = {
    downloadFeatures: downloadFeatures,
    uploadReports: uploadReports
};
