'use strict';

export default class BufferLoader {
    constructor(context, urls) {
        this.context = context;
        this.urls = urls;
    }

    loadSample(url) {
        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onload = function() {
                this.context.decodeAudioData(request.response, resolve, reject);
            }.bind(this);
            request.onerror = reject;
            request.send();
        });
    }

    load() {
        return Promise.all(this.urls.map(this.loadSample, this));
    }
}
