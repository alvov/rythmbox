'use strict';

import patternGenerator from './rythmbox-pattern-generator';
import BufferLoader from './rythmbox-buffer-loader';

export default class Rythmbox {
    constructor(params) {
        var state = {
            tempo: params.tempo,
            playing: true,
            loopCount: 1,
            patternComplexity: 0,
            currentPattern: {
                bars: []
            }
        };
        this.muted = {};

        this.urls = params.urls;
        this.audioCtx = null;
        this.changeCallbacks = [];
        this.state = {
            get(key) {
                if (key === undefined) {
                    return Object.assign({}, state);
                }
                return state[key];
            },
            set: function(key, value) {
                if (state[key] !== value) {
                    state[key] = value;
                    this.changeCallbacks.forEach(callback => {
                        callback(key);
                    });
                }
            }.bind(this)
        };
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
            loopCount: this.state.get('loopCount'),
            difficulty: this.state.get('patternComplexity')
        });
    }

    loop(immediately) {
        var pattern;
        setTimeout(() => {
            if (pattern) {
                this.state.set('currentPattern', pattern);
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
                this.state.set('loopCount', this.state.get('loopCount') + 1);
            }

            this.loop();
        }, immediately ? 0 : 4 * 1000 * 60 / this.state.get('tempo'));

        if (this.state.get('playing')) {
            pattern = this.getPattern();
        }
    }

    playChunk(buffer, bar, startTime) {
        var source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioCtx.destination);
        source.start(startTime + bar * 15 / this.state.get('tempo'));
    }

    play() {
        this.state.set('playing', true);
    }

    stop() {
        this.state.set('playing', false);
    }

    onChange(callback) {
        this.changeCallbacks.push(callback);
    }
}
