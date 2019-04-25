'use strict'

var assertThat = require('../lib/assertthat-bdd');

function checkArgs(settings){
    if(!settings.projectId){
        throw new Error('projectId setting is required');
    }
    if(!settings.accessKey){
        throw new Error('accessKey setting is required');
    }
    if(!settings.secretKey){
        throw new Error('secretKey setting is required');
    }
}

module.exports = {
    downloadFeatures:  function(settings, callback) {
        checkArgs(settings);
        assertThat.downloadFeatures(settings, function() {
            if (callback) callback();
        });
    },
    uploadReports: function(settings, callback) {
        checkArgs(settings);
        assertThat.uploadReports(settings, function() {
            if (callback) callback();
        });
    }
}