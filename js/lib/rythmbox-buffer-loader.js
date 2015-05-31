'use strict';

var BufferLoader = function(context, urls) {
    this.context = context;
    this.urls = urls;
};
BufferLoader.prototype.loadSample = function(url) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            this.context.decodeAudioData(request.response, resolve, reject);
        }.bind(this);
        request.onerror = reject;
        request.send();
    }.bind(this));
};
BufferLoader.prototype.load = function() {
    return Promise.all(this.urls.map(this.loadSample, this));
};

module.exports = BufferLoader;