'use strict';

import patternGenerator from './rythmbox-pattern-generator';
import BufferLoader from './rythmbox-buffer-loader';
import utils from './utils'

var state = Symbol('state');

export default class Rythmbox {
    constructor(params) {
        this.muted = {};

        this.urls = params.urls;
        this.audioCtx = null;
        this.changeCallbacks = [];
        this[state] = utils.dataset({
            tempo: params.tempo,
            playing: true,
            loopCount: 1,
            patternComplexity: 0,
            currentPattern: {
                bars: []
            }
        });
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        catch(e) {
            alert('Web Audio API is not supported in this browser');
        }

        this.bufferLoader = new BufferLoader(this.audioCtx, this.urls);
        this.bufferLoader.load()
            .then(result => {
                this.bufferList = result;
                this.loop(true);
            })
            .catch(err => {
                alert(err);
            });
    }

    getPattern() {
        return patternGenerator.getPattern({
            loopCount: this[state].get('loopCount'),
            difficulty: this[state].get('patternComplexity')
        });
    }

    loop(immediately) {
        var pattern;
        setTimeout(() => {
            if (pattern) {
                this.setState({ currentPattern: pattern });
                var loopStartTime = this.audioCtx.currentTime;
                this.bufferList.forEach((buffer, i) => {
                    if (!this.muted[i] && pattern.bars[i]) {
                        pattern.bars[i].forEach((play, bar) => {
                            if (play) {
                                this.playChunk(buffer, bar, loopStartTime);
                            }
                        });
                    }
                });
                this.setState({ loopCount: this[state].get('loopCount') + 1 });
            }

            this.loop();
        }, immediately ? 0 : 4 * 1000 * 60 / this[state].get('tempo'));

        if (this[state].get('playing')) {
            pattern = this.getPattern();
        }
    }

    playChunk(buffer, bar, startTime) {
        var source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioCtx.destination);
        source.start(startTime + bar * 15 / this[state].get('tempo'));
    }

    play() {
        this.setState({ playing: true });
    }

    stop() {
        this.setState({ playing: false });
    }

    getState() {
        return this[state].get();
    }

    setState(data) {
        var delta = this[state].set(data);
        Object.keys(delta).forEach(key => {
            this.changeCallbacks.forEach(callback => {
                callback(key);
            });
        })
    }

    onChange(callback) {
        this.changeCallbacks.push(callback);
    }
}
