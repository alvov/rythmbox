'use strict';

import constants from './rythmbox-constants';
import patternGenerator from './rythmbox-pattern-generator';
import BufferLoader from './rythmbox-buffer-loader';
import utils from '../utils';

var state = Symbol('state');

export default class Rythmbox {
    constructor(params) {
        this.muted = {};

        this.urls = params.urls;
        this.audioCtx = null;

        this.scheduleInterval = null;
        this.nextBarTime = 0;
        this.barCount = 0;
        this.loopCount = 1;
        this.barsQueue = [];
        this.currentPattern = {};

        this.changeCallback = function() {};
        this[state] = utils.dataset({
            loading: true,
            playing: false,
            patternComplexity: 0,
            tempo: params.tempo
        });
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        catch(e) {
            alert('Web Audio API is not supported in this browser');
        }

        this.currentPattern = this.getPattern();
        new BufferLoader(this.audioCtx, this.urls)
            .load()
            .then(result => {
                this.bufferList = result;
                this.setState({ loading: false });
                requestAnimationFrame(this.publish.bind(this));
            })
            .catch(err => {
                console.error(err || 'Couldn\'t load sounds');
            });
    }

    nextBar() {
        this.nextBarTime += 15 / this[state].get('tempo');
        this.barCount++;
        if (this.barCount === constants.BARS) {
            this.barCount = 0;
            this.loopCount++;
            this.currentPattern = this.getPattern();
            this.currentPattern.isNew = true;
        }
    }

    scheduleChunks() {
        this.barsQueue.push({ bar: this.barCount, time: this.nextBarTime });

        this.bufferList.forEach((buffer, i) => {
            if (
                !this.muted[i] &&
                this.currentPattern.bars[i] &&
                this.currentPattern.bars[i][this.barCount]
            ) {
                let source = this.audioCtx.createBufferSource();
                source.buffer = buffer;
                source.connect(this.audioCtx.destination);
                source.start(this.nextBarTime);
            }
        });
    }

    schedule() {
        var currentTime = this.audioCtx.currentTime;
        while (this.nextBarTime < currentTime + constants.SCHEDULE_AHEAD_TIME) {
            this.scheduleChunks();
            this.nextBar();
        }
    }

    play() {
        this.nextBarTime = this.audioCtx.currentTime;
        this.barCount = 0;

        this.schedule();
        this.scheduleInterval = setInterval(this.schedule.bind(this), constants.SCHEDULE_INTERVAL);

        this.setState({ playing: true });
    }

    stop() {
        if (this.scheduleInterval) {
            clearInterval(this.scheduleInterval);
            this.scheduleInterval = null;
        }

        this.setState({ playing: false });
    }

    publish() {
        var currentTime = this.audioCtx.currentTime;
        var currentBar;
        var newPattern;
        while (this.barsQueue.length && this.barsQueue[0].time < currentTime) {
            currentBar = this.barsQueue[0].bar;
            if (currentBar === 0) {
                newPattern = true;
            }
            this.barsQueue.shift();
        }

        // set cursor to 0 when stopped
        if (this[state].get('playing') === false && currentBar !== 0) {
            currentBar = 0;
        }

        if (currentBar !== undefined) {
            this.changeCallback('bar', currentBar);
            if (this.currentPattern.isNew) {
                delete this.currentPattern.isNew;
                this.changeCallback('pattern');
            }
        }

        requestAnimationFrame(this.publish.bind(this));
    }

    getState() {
        return this[state].get();
    }

    setState(data) {
        var delta = this[state].set(data);
        Object.keys(delta).forEach(key => {
            this.changeCallback(key);
        })
    }

    onChange(callback) {
        this.changeCallback = callback;
    }

    getPattern() {
        return patternGenerator.getPattern({
            loopCount: this.loopCount,
            complexity: this[state].get('patternComplexity'),
            samplesCount: this.urls.length
        });
    }
}
