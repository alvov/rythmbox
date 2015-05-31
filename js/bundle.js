(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react');
var SamplesTimeline = require('./components/samples-timeline');
var Controls = require('./components/controls');

React.render(
    React.createElement(SamplesTimeline, null),
    document.getElementById('visuals')
);

React.render(
    React.createElement(Controls, null),
    document.getElementById('controls')
);

},{"./components/controls":3,"./components/samples-timeline":4,"react":"react"}],2:[function(require,module,exports){
'use strict';

var AppDispatcher = require('../dispatcher/app-dispatcher');
var Actions = {
    togglePlay: function(on) {
        AppDispatcher.dispatch({
            actionType: 'togglePlay',
            on: on
        });
    },
    toggleBuffer: function(id) {
        AppDispatcher.dispatch({
            actionType: 'toggleBuffer',
            id: id
        });
    },
    setTempo: function(tempo) {
        AppDispatcher.dispatch({
            actionType: 'setTempo',
            tempo: tempo
        });
    },
    setComplexity: function(complexity) {
        AppDispatcher.dispatch({
            actionType: 'setComplexity',
            complexity: complexity
        });
    }
};

module.exports = Actions;

},{"../dispatcher/app-dispatcher":5}],3:[function(require,module,exports){
'use strict';

var React = require('react');
var Store = require('../stores/store');
var Actions = require('../actions/actions');

var DIFFICULTY_LEVELS = 2;

var Controls = React.createClass({displayName: "Controls",
    render: function() {
        return (
            React.createElement("div", {className: "controls"}, 
                React.createElement(PlayButton, null), 
                React.createElement(Tempo, null), 
                React.createElement(PatternComplexity, null)
            )
        );
    }
});
var PlayButton = React.createClass({displayName: "PlayButton",
    getInitialState: function() {
        return { playing: Store.getState().playing };
    },
    componentDidMount: function() {
        Store.addChangeListener(this.onPlayStateChange);
    },
    componentWillUnmount: function() {
        Store.removeChangeListener(this.onPlayStateChange);
    },
    togglePlay: function() {
        Actions.togglePlay(!this.state.playing);
    },
    render: function() {
        return React.createElement("button", {className: "play-button", onClick: this.togglePlay}, this.state.playing ? 'Stop' : 'Play')
    },
    onPlayStateChange: function(key) {
        if (key === 'playing') {
            this.setState({playing: Store.getState().playing});
        }
    }
});
var Tempo = React.createClass({displayName: "Tempo",
    getInitialState: function() {
        return { tempo: Store.getState().tempo };
    },
    componentDidMount: function() {
        Store.addChangeListener(this.onTempoChange);
    },
    componentWillUnmount: function() {
        Store.removeChangeListener(this.onTempoChange);
    },
    render: function() {
        return (
            React.createElement("div", {className: "tempo"}, 
                React.createElement("label", null, "Tempo"), 
                React.createElement("input", {className: "tempo__input", type: "range", min: "120", max: "170", value: this.state.tempo, onChange: this.setTempo}), 
                React.createElement("span", {className: "tempo__count"}, this.state.tempo)
            )
        );
    },
    setTempo: function(e) {
        Actions.setTempo(Number(e.target.value));
    },
    onTempoChange: function(key) {
        if (key === 'tempo') {
            this.setState({ tempo: Store.getState().tempo });
        }
    }
});
var PatternComplexity = React.createClass({displayName: "PatternComplexity",
    getInitialState: function() {
        return { complexity: Store.getState().patternComplexity };
    },
    componentDidMount: function() {
        Store.addChangeListener(this.onComplexityChange);
    },
    componentWillUnmount: function() {
        Store.removeChangeListener(this.onComplexityChange);
    },
    render: function() {
        var inputs = [];
        var i = 0;
        for (; i < DIFFICULTY_LEVELS; i++) {
            inputs.push(
                React.createElement("input", {type: "radio", name: "complexity", 
                    key: i, id: 'complexity' + i, value: i, onChange: this.setComplexity, 
                    checked: Number(this.state.complexity) === i})
            );
        }
        return (
            React.createElement("div", {className: "complexity"}, 
                React.createElement("label", null, "Complexity"), 
                inputs
            )
        );
    },
    setComplexity: function(e) {
        Actions.setComplexity(e.target.value);
    },
    onComplexityChange: function(key) {
        if (key === 'patternComplexity') {
            this.setState({ complexity: Store.getState().patternComplexity });
        }
    }
});

module.exports = Controls;

},{"../actions/actions":2,"../stores/store":10,"react":"react"}],4:[function(require,module,exports){
'use strict';

var React = require('react');
var Store = require('../stores/store');
var Actions = require('../actions/actions');

var SampleBar = React.createClass({displayName: "SampleBar",
    render: function() {
        var className = ['bar', this.props.className].join(' ');
        return React.createElement("div", {className: className});
    }
});
var TimelineToggle = React.createClass({displayName: "TimelineToggle",
    render: function() {
        return React.createElement("button", {className: "toggle", onClick: this.props.onclick}, this.props.children)
    }
});
var SampleTimeline = React.createClass({displayName: "SampleTimeline",
    propTypes: {
        samplePattern: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
    },
    getInitialState: function() {
        return {
            name: '',
            muted: false
        };
    },
    componentDidMount: function() {
        this.setState({ name: Store.getBufferName(this.props.id) });
    },
    render: function() {
        var bars = this.props.samplePattern.map(function(play) {
            var barClass = play ? 'fill' : 'empty';
            return React.createElement(SampleBar, {className: barClass});
        });
        return (
            React.createElement("div", {className: 'line' + (this.state.muted ? ' muted' : '')}, 
                React.createElement(TimelineToggle, {onclick: this.toggle}, this.state.name), 
                bars
            )
        );
    },
    toggle: function() {
        this.setState({ muted: !this.state.muted });
        Actions.toggleBuffer(this.props.id);
    }
});
var TimelineCursor = React.createClass({displayName: "TimelineCursor",
    getInitialState: function() {
        return { cursorPos: 0 }
    },
    render: function() {
        return React.createElement("div", {className: "cursor", style: {left: this.state.cursorPos + '%'}});
    },
    interval: null,
    reset: function(tempo) {
        var i = 0;
        clearInterval(this.interval);
        this.interval = setInterval(function() {
            i++;
            this.setState({ cursorPos: i * 100 / 16 });
            if (i === 16) {
                clearInterval(this.interval);
                this.interval = null;
                this.setState({ cursorPos: 0 });
            }
        }.bind(this), 1000 * 15 / tempo);
        this.setState({ cursorPos: 0 });
    }
});
var SamplesTimeline = React.createClass({displayName: "SamplesTimeline",
    getInitialState: function() {
        return { pattern: Store.getState().currentPattern };
    },
    componentDidMount: function() {
        Store.addChangeListener(this.onStateChange);
    },
    componentWillUnmount: function() {
        Store.removeChangeListener(this.onStateChange);
    },
    render: function() {
        var samplesLines = this.state.pattern.bars.map(function(samplePattern, i) {
            return React.createElement(SampleTimeline, {id: i, samplePattern: samplePattern});
        });
        return (
            React.createElement("div", {className: "box clearfix"}, 
                React.createElement(TimelineCursor, {ref: "cursor"}), 
                samplesLines
            )
        );
    },
    onStateChange: function(key) {
        if (key === 'currentPattern') {
            var rythmBoxState = Store.getState();
            this.setState({ pattern: rythmBoxState.currentPattern });
            this.refs.cursor.reset(rythmBoxState.tempo);
        }
    }
});

module.exports = SamplesTimeline;

},{"../actions/actions":2,"../stores/store":10,"react":"react"}],5:[function(require,module,exports){
'use strict';

var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();

},{"flux":"flux"}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var objectAssign = require('object-assign');

var Collection = function() {
    var collection = {
        0: {
            plain: [
                { bars: [
                    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
                ] },
                { bars: [
                    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1]
                ] },
                { bars: [
                    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
                ] },
                { bars: [
                    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
                ] }
            ],
            breaks: [
                { bars: [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1]
                ] },
                { bars: [
                    [1, 0, 0],
                    [0, 1, 1]
                ] }
            ],
            filters: []
        },
        1: {
            plain: [
                { bars: [
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
                    [1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ] },
                { bars: [
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0],
                    [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
                    [0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
                    [1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ] },
                { bars: [
                    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ] },
                { bars: [
                    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
                    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
                    [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
                    [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ] }
            ],
            breaks: [
                { bars: [
                    [1, 0],
                    [0, 1]
                ] }
            ]
        }
    };
    return {
        get: function(difficulty, category) {
            var source = collection[difficulty];
            if (source === undefined) {
                source = collection[Math.max.apply(null, Object.keys(this.collection))];
            }
            source = source[category];
            var result = source;
            if (category !== 'filter') {
                source = source[utils.random.number(0, source.length - 1)];
                result = {
                    bars: source.bars.map(function(samplePattern) {
                        return samplePattern.slice(0);
                    })
                }
            }
            return result;
        }
    }
};

var patternGenerator = {
    collection: new Collection(),
    replace: function(source, newPattern, params) {
        var startPoint = 0;
        params = objectAssign({
            place: 'start',
            merge: false
        }, params);
        if (params.place === 'end') {
            startPoint = source.bars[0].length - newPattern.bars[0].length
        }
        source.bars.forEach(function(samplePattern, i) {
            if (newPattern.bars[i]) {
                newPattern.bars[i].forEach(function(newBar, j) {
                    if (!params.merge || newBar) {
                        samplePattern[j + startPoint] = newBar;
                    }
                });
            }
        });
        return source;
    },
    getPattern: function(params) {
        var pattern;
        var patternBreak;
        params = objectAssign({
            loopCount: 1,
            difficulty: 0
        }, params);
        pattern = this.collection.get(params.difficulty, 'plain');
        if (params.loopCount % 4 === 0) {
            patternBreak = this.collection.get(params.difficulty, 'breaks');
            pattern = this.replace(pattern, patternBreak, { place: 'end' });
        }
        return pattern;
    }
};

module.exports = patternGenerator;

},{"./utils":9,"object-assign":"object-assign"}],8:[function(require,module,exports){
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
        this.loop();
    }.bind(this));

};
RythmBox.prototype.getPattern = function() {
    return patternGenerator.getPattern({
        loopCount: this.state.get('loopCount'),
        difficulty: this.state.get('patternComplexity')
    });
};
RythmBox.prototype.loop = function() {
    if (this.state.get('playing')) {
        var loopStartTime = this.audioCtx.currentTime;
        var pattern = this.getPattern();
        this.state.set('currentPattern', pattern);
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
    setTimeout(this.loop.bind(this), 4 * 1000 * 60 / this.state.get('tempo'));
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

},{"./rythmbox-buffer-loader":6,"./rythmbox-pattern-generator":7,"object-assign":"object-assign"}],9:[function(require,module,exports){
'use strict';

var PubSub = function(){
    var hash = {};
    this.subscribe = function(event, callback){
        if (!hash[event]) {
            hash[event] = [];
        }
        hash[event].push(callback);
    };
    this.unsubscribe = function(event, callback){
        if (undefined === callback) {
            hash[event] = [];
        } else if (hash[event]){
            hash[event].forEach(function(value, i){
                if (value === callback) {
                    hash[event].splice(i, 1);
                }
            });
        }
    };
    this.publish = function(event, data){
        if (hash[event]) {
            hash[event].forEach(function(value){
                value(data);
            });
        }
    };
};

var ObservableValue = function(value){
    var callbacks = [];
    return {
        value: value,
        set: function(value){
            this.value = value;
            callbacks.forEach(function(callback){
                callback(this.value);
            }.bind(this));
        },
        onChange: function(callback){
            callback(this.value);
            callbacks.push(callback);
        }
    }
};

var utils = {
    extend: function(){
        var i = 0,
            l = arguments.length,
            result = arguments[0],
            key;
        for (; ++i < l;) {
            if (typeof arguments[i] === 'object') {
                for (key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        result[key] = arguments[i][key];
                    }
                }
            }
        }
        return result;
    },
    random: {
        number: function(min, max){
            min = undefined === min ? 0 : min;
            max = undefined === max ? 1 : max;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        color: function(){
            var color = [],
                i = -1;
            for (;++i < 3;) {
                color.push(utils.random.number(0, 255));
            }
            return 'rgb(' + color.join() + ')';
        }
    },
    vectors: {
        add: function(v1, v2){
            return v1.map(function(value, i){
                return value + v2[i];
            });
        },
        intersect: function(v1, v2){
            return v1.reduce(function(prev, cur){
                return prev || v2.indexOf(cur) !== -1;
            }, false);
        }
    },
    round: function(value, precision){
        return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
    },
    pubsub: new PubSub(),
    angle: {
        PI: 3.1415,
        toRad: function(degrees){
            return degrees * this.PI / 180;
        },
        toDeg: function(radians){
            return radians * 180 / this.PI;
        }
    },
    observableValue: function(value){
        return new ObservableValue(value);
    }
};

module.exports = utils;

},{}],10:[function(require,module,exports){
'use strict';

var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var RythmBox = require('../lib/rythmbox');
var objectAssign = require('object-assign');

var rythmBox = new RythmBox({
    tempo: 160,
    urls: [
        '/sounds/kick.ogg',
        '/sounds/snare.ogg',
        '/sounds/hat_01.ogg',
        '/sounds/hat_02.ogg',
        '/sounds/hat_03.ogg',
        '/sounds/crash.ogg'        
    ]
});

var Store = objectAssign({}, EventEmitter.prototype, {
    getState: function() {
        return rythmBox.state.get();
    },
    getBufferName: function(id) {
        var url = rythmBox.urls[id];
        return url.split('/').pop();
    },
    addChangeListener: function(callback) {
        this.on('change', callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },
    emitChange: function(key) {
        this.emit('change', key);
    },
    dispatcherIndex: AppDispatcher.register(function(action) {
        switch(action.actionType) {
            case 'setTempo':
                rythmBox.state.set('tempo', action.tempo);
                break;

            case 'setComplexity':
                rythmBox.state.set('patternComplexity', action.complexity);
                break;

            case 'togglePlay':
                if (action.on) {
                    rythmBox.play();
                } else {
                    rythmBox.stop();
                }
                break;

            case 'toggleBuffer':
                if (rythmBox.muted[action.id]) {
                    delete rythmBox.muted[action.id];
                } else {
                    rythmBox.muted[action.id] = true;
                }
                break;
        }

        return true;
    })
});

rythmBox.onChange(Store.emitChange.bind(Store));

module.exports = Store;

},{"../dispatcher/app-dispatcher":5,"../lib/rythmbox":8,"events":"events","object-assign":"object-assign"}]},{},[1]);
