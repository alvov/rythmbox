'use strict';

var patternGenerator = require('./rythmbox-pattern-generator');
var BufferLoader = require('./rythmbox-buffer-loader');
var objectAssign = require('object-assign');

var RythmBox = function(params) {
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
        get: function(key) {
            if (key === undefined) {
                return objectAssign({}, state);
            }
            return state[key];
        },
        set: function(key, value) {
            if (state[key] !== value) {
                state[key] = value;
                this.changeCallbacks.forEach(function(callback) {
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
    this.bufferLoader.load().then(function(result) {
        this.bufferList = result;
        this.loop(true);
    }.bind(this));

};
RythmBox.prototype.getPattern = function() {
    return patternGenerator.getPattern({
        loopCount: this.state.get('loopCount'),
        difficulty: this.state.get('patternComplexity')
    });
};
RythmBox.prototype.loop = function(immediately) {
    var pattern;

    setTimeout(function() {
        if (pattern) {
            this.state.set('currentPattern', pattern);
            var loopStartTime = this.audioCtx.currentTime;
            this.bufferList.forEach(function(buffer, i) {
                if (!this.muted[i] && pattern.bars[i]) {
                    pattern.bars[i].forEach(function(play, bar) {
                        if (play) {
                            this.playChunk(buffer, bar, loopStartTime);
                        }
                    }.bind(this));
                }
            }.bind(this));
            this.state.set('loopCount', this.state.get('loopCount') + 1);
        }

        this.loop();
    }.bind(this), immediately ? 0 : 4 * 1000 * 60 / this.state.get('tempo'));

    if (this.state.get('playing')) {
        pattern = this.getPattern();
    }
};
RythmBox.prototype.playChunk = function(buffer, bar, startTime) {
    var source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioCtx.destination);
    source.start(startTime + bar * 15 / this.state.get('tempo'));
};
RythmBox.prototype.play = function() {
    this.state.set('playing', true);
};
RythmBox.prototype.stop = function() {
    this.state.set('playing', false);
};
RythmBox.prototype.onChange = function(callback) {
    this.changeCallbacks.push(callback);
};

module.exports = RythmBox;