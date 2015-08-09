'use strict';

export default class BufferLoader {
    constructor(context, urls) {
        this.context = context;
        this.urls = urls;
    }

    loadSample(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    response.arrayBuffer().then(buffer => {
                        this.context.decodeAudioData(buffer, resolve, reject)
                    });
                })
                .catch(reject)
            ;
        });
    }

    load() {
        return Promise.all(this.urls.map(this.loadSample, this));
    }
}
