(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentsSamplesTimeline = require('./components/samples-timeline');

var _componentsSamplesTimeline2 = _interopRequireDefault(_componentsSamplesTimeline);

var _componentsControls = require('./components/controls');

var _componentsControls2 = _interopRequireDefault(_componentsControls);

_react2['default'].render(_react2['default'].createElement(_componentsSamplesTimeline2['default'], null), document.getElementById('visuals'));

_react2['default'].render(_react2['default'].createElement(_componentsControls2['default'], null), document.getElementById('controls'));

},{"./components/controls":3,"./components/samples-timeline":4,"react":"react"}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatcherAppDispatcher = require('../dispatcher/app-dispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

exports['default'] = {
    togglePlay: function togglePlay(on) {
        _dispatcherAppDispatcher2['default'].dispatch({
            actionType: 'togglePlay',
            on: on
        });
    },
    toggleBuffer: function toggleBuffer(id) {
        _dispatcherAppDispatcher2['default'].dispatch({
            actionType: 'toggleBuffer',
            id: id
        });
    },
    setTempo: function setTempo(tempo) {
        _dispatcherAppDispatcher2['default'].dispatch({
            actionType: 'setTempo',
            tempo: tempo
        });
    },
    setComplexity: function setComplexity(complexity) {
        _dispatcherAppDispatcher2['default'].dispatch({
            actionType: 'setComplexity',
            complexity: complexity
        });
    }
};
module.exports = exports['default'];

},{"../dispatcher/app-dispatcher":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storesStore = require('../stores/store');

var _storesStore2 = _interopRequireDefault(_storesStore);

var _actionsActions = require('../actions/actions');

var _actionsActions2 = _interopRequireDefault(_actionsActions);

var DIFFICULTY_LEVELS = 2;

var Controls = _react2['default'].createClass({
    displayName: 'Controls',

    render: function render() {
        return _react2['default'].createElement(
            'div',
            { className: 'controls' },
            _react2['default'].createElement(PlayButton, null),
            _react2['default'].createElement(Tempo, null),
            _react2['default'].createElement(PatternComplexity, null)
        );
    }
});
var PlayButton = _react2['default'].createClass({
    displayName: 'PlayButton',

    getInitialState: function getInitialState() {
        return { playing: _storesStore2['default'].getState().playing };
    },
    componentDidMount: function componentDidMount() {
        _storesStore2['default'].addChangeListener(this.onPlayStateChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        _storesStore2['default'].removeChangeListener(this.onPlayStateChange);
    },
    togglePlay: function togglePlay() {
        _actionsActions2['default'].togglePlay(!this.state.playing);
    },
    render: function render() {
        return _react2['default'].createElement(
            'button',
            { className: 'play-button', onClick: this.togglePlay },
            this.state.playing ? 'Stop' : 'Play'
        );
    },
    onPlayStateChange: function onPlayStateChange(key) {
        if (key === 'playing') {
            this.setState({ playing: _storesStore2['default'].getState().playing });
        }
    }
});
var Tempo = _react2['default'].createClass({
    displayName: 'Tempo',

    getInitialState: function getInitialState() {
        return { tempo: _storesStore2['default'].getState().tempo };
    },
    componentDidMount: function componentDidMount() {
        _storesStore2['default'].addChangeListener(this.onTempoChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        _storesStore2['default'].removeChangeListener(this.onTempoChange);
    },
    render: function render() {
        return _react2['default'].createElement(
            'div',
            { className: 'tempo' },
            _react2['default'].createElement(
                'label',
                null,
                'Tempo'
            ),
            _react2['default'].createElement('input', { className: 'tempo__input', type: 'range', min: '120', max: '170', value: this.state.tempo, onChange: this.setTempo }),
            _react2['default'].createElement(
                'span',
                { className: 'tempo__count' },
                this.state.tempo
            )
        );
    },
    setTempo: function setTempo(e) {
        _actionsActions2['default'].setTempo(Number(e.target.value));
    },
    onTempoChange: function onTempoChange(key) {
        if (key === 'tempo') {
            this.setState({ tempo: _storesStore2['default'].getState().tempo });
        }
    }
});
var PatternComplexity = _react2['default'].createClass({
    displayName: 'PatternComplexity',

    getInitialState: function getInitialState() {
        return { complexity: _storesStore2['default'].getState().patternComplexity };
    },
    componentDidMount: function componentDidMount() {
        _storesStore2['default'].addChangeListener(this.onComplexityChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        _storesStore2['default'].removeChangeListener(this.onComplexityChange);
    },
    render: function render() {
        var inputs = [];
        for (var i = 0; i < DIFFICULTY_LEVELS; i++) {
            inputs.push(_react2['default'].createElement('input', { type: 'radio', name: 'complexity',
                key: i, id: 'complexity' + i, value: i, onChange: this.setComplexity,
                checked: Number(this.state.complexity) === i }));
        }
        return _react2['default'].createElement(
            'div',
            { className: 'complexity' },
            _react2['default'].createElement(
                'label',
                null,
                'Complexity'
            ),
            inputs
        );
    },
    setComplexity: function setComplexity(e) {
        _actionsActions2['default'].setComplexity(e.target.value);
    },
    onComplexityChange: function onComplexityChange(key) {
        if (key === 'patternComplexity') {
            this.setState({ complexity: _storesStore2['default'].getState().patternComplexity });
        }
    }
});

exports['default'] = Controls;
module.exports = exports['default'];

},{"../actions/actions":2,"../stores/store":10,"react":"react"}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storesStore = require('../stores/store');

var _storesStore2 = _interopRequireDefault(_storesStore);

var _actionsActions = require('../actions/actions');

var _actionsActions2 = _interopRequireDefault(_actionsActions);

var SampleBar = _react2['default'].createClass({
    displayName: 'SampleBar',

    render: function render() {
        var className = 'bar ' + this.props.className;
        return _react2['default'].createElement('div', { className: className });
    }
});
var TimelineToggle = _react2['default'].createClass({
    displayName: 'TimelineToggle',

    render: function render() {
        return _react2['default'].createElement(
            'button',
            { className: 'toggle', onClick: this.props.onclick },
            this.props.children
        );
    }
});
var SampleTimeline = _react2['default'].createClass({
    displayName: 'SampleTimeline',

    propTypes: {
        samplePattern: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.number).isRequired
    },
    getInitialState: function getInitialState() {
        return {
            name: '',
            muted: false
        };
    },
    componentDidMount: function componentDidMount() {
        this.setState({ name: _storesStore2['default'].getBufferName(this.props.id) });
    },
    render: function render() {
        var bars = this.props.samplePattern.map(function (play) {
            var barClass = play ? 'fill' : 'empty';
            return _react2['default'].createElement(SampleBar, { className: barClass });
        });
        return _react2['default'].createElement(
            'div',
            { className: 'line' + (this.state.muted ? ' muted' : '') },
            _react2['default'].createElement(
                TimelineToggle,
                { onclick: this.toggle },
                this.state.name
            ),
            bars
        );
    },
    toggle: function toggle() {
        this.setState({ muted: !this.state.muted });
        _actionsActions2['default'].toggleBuffer(this.props.id);
    }
});
var TimelineCursor = _react2['default'].createClass({
    displayName: 'TimelineCursor',

    getInitialState: function getInitialState() {
        return { cursorPos: 0 };
    },
    render: function render() {
        return _react2['default'].createElement('div', { className: 'cursor', style: { left: this.state.cursorPos + '%' } });
    },
    interval: null,
    reset: function reset(tempo) {
        var _this = this;

        var i = 0;
        clearInterval(this.interval);
        this.interval = setInterval(function () {
            i++;
            _this.setState({ cursorPos: i * 100 / 16 });
            if (i === 16) {
                clearInterval(_this.interval);
                _this.interval = null;
                _this.setState({ cursorPos: 0 });
            }
        }, 1000 * 15 / tempo);
        this.setState({ cursorPos: 0 });
    }
});
var SamplesTimeline = _react2['default'].createClass({
    displayName: 'SamplesTimeline',

    getInitialState: function getInitialState() {
        return { pattern: _storesStore2['default'].getState().currentPattern };
    },
    componentDidMount: function componentDidMount() {
        _storesStore2['default'].addChangeListener(this.onStateChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        _storesStore2['default'].removeChangeListener(this.onStateChange);
    },
    render: function render() {
        var samplesLines = this.state.pattern.bars.map(function (samplePattern, i) {
            return _react2['default'].createElement(SampleTimeline, { id: i, samplePattern: samplePattern });
        });
        return _react2['default'].createElement(
            'div',
            { className: 'box clearfix' },
            _react2['default'].createElement(TimelineCursor, { ref: 'cursor' }),
            samplesLines
        );
    },
    onStateChange: function onStateChange(key) {
        if (key === 'currentPattern') {
            var rythmBoxState = _storesStore2['default'].getState();
            this.setState({ pattern: rythmBoxState.currentPattern });
            this.refs.cursor.reset(rythmBoxState.tempo);
        }
    }
});

exports['default'] = SamplesTimeline;
module.exports = exports['default'];

},{"../actions/actions":2,"../stores/store":10,"react":"react"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _flux = require('flux');

exports['default'] = new _flux.Dispatcher();
module.exports = exports['default'];

},{"flux":"flux"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BufferLoader = (function () {
    function BufferLoader(context, urls) {
        _classCallCheck(this, BufferLoader);

        this.context = context;
        this.urls = urls;
    }

    _createClass(BufferLoader, [{
        key: 'loadSample',
        value: function loadSample(url) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                fetch(url).then(function (response) {
                    response.arrayBuffer().then(function (buffer) {
                        _this.context.decodeAudioData(buffer, resolve, reject);
                    });
                })['catch'](reject);
            });
        }
    }, {
        key: 'load',
        value: function load() {
            return Promise.all(this.urls.map(this.loadSample, this));
        }
    }]);

    return BufferLoader;
})();

exports['default'] = BufferLoader;
module.exports = exports['default'];

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var collection = {
    0: {
        plain: [{
            bars: ['1000000010000000', '0000100000001000', '0000000000000010', '0010001000100010', '1010101010101010', '0101000010001000']
        }, {
            bars: ['1000000010000000', '0000101000001000', '0000000000000010', '0010001000100010', '1010101010101010', '0101000010001000']
        }],
        breaks: [{
            bars: ['10000', '00011', '00100'],
            merge: true
        }, {
            bars: ['10100', '', '', '', '', '00100'],
            merge: true
        }, {
            bars: ['10010000', '00001101', '00100000', '00101010', '10100101', '10010000']
        }, {
            bars: ['1001001000100000', '0000100100001110', '0000000001000000', '0010001000100010', '1010101010101110', '0101000001010000']
        }],
        filters: [],
        crash: [{
            bars: ['', '', '', '', '', '', '1'],
            merge: true,
            startPoint: 0
        }]
    },
    1: {
        plain: [{
            bars: ['1000000000100100', '0000100000001000', '0000000101000000', '0010001000100010', '1000000000100100', '0101010011010011']
        }, {
            bars: ['1000000000100010', '0000100100001100', '0000001001000000', '0010001000100010', '1000100000100010', '0101010101010101']
        }, {
            bars: ['1000000000100000', '0000100001001001', '0000000100000000', '0010001001001010', '1000100010000001', '0101010010010101']
        }, {
            bars: ['1001000000100000', '0000100100001000', '0000001001000000', '0010001001000100', '1001000100100010', '0100010010010001']
        }],
        breaks: [{
            bars: ['1010000000100000', '0000100100001111', '0100000001000000', '0010001000100010', '1010000010100010', '0100100101000101']
        }, {
            bars: ['10010100', '01001011', '00100000', '10010010', '01000010', '00011100']
        }, {
            bars: ['1010001001110100', '0000100100001000', '0000010000000011', '0010001000001010', '1000000100001000', '0101010110000000']
        }, {
            bars: ['100100100', '000001001', '001010010', '001001001', '100100100', '010010010']
        }],
        crash: [{
            bars: ['', '', '', '', '', '', '1'],
            merge: true,
            startPoint: 0
        }]
    }
};

var Collection = (function () {
    function Collection() {
        _classCallCheck(this, Collection);
    }

    _createClass(Collection, [{
        key: 'get',
        value: function get(complexity, category) {
            var source = collection[complexity];
            if (source === undefined) {
                source = collection[Math.max.apply(Math, _toConsumableArray(Object.keys(collection)))];
            }
            source = source[category];
            var result = source;
            if (category !== 'filter') {
                if (source.length > 1) {
                    source = source[_utils2['default'].random.number(0, source.length - 1)];
                } else {
                    source = source[0];
                }
                result = {
                    bars: source.bars.map(function (samplePattern) {
                        return Object.keys(samplePattern).map(function (i) {
                            return Number(samplePattern[i]);
                        });
                    }),
                    merge: source.merge,
                    startPoint: source.startPoint
                };
            }
            return result;
        }
    }]);

    return Collection;
})();

exports['default'] = {
    collection: new Collection(),
    replace: function replace(source, newPattern) {
        var startPoint = newPattern.startPoint !== undefined ? newPattern.startPoint : source.bars[0].length - newPattern.bars[0].length;
        var merge = Boolean(newPattern.merge);
        newPattern.bars.forEach(function (newSamplePattern, i) {
            if (newSamplePattern) {
                newSamplePattern.forEach(function (newBar, j) {
                    if (!merge || newBar) {
                        if (!source.bars[i]) {
                            source.bars[i] = new Array(16).fill(0);
                        }
                        source.bars[i][j + startPoint] = newBar;
                    }
                });
            }
        });
    },
    getPattern: function getPattern(params) {
        var pattern;
        var patternBreak;
        params = Object.assign({
            loopCount: 1,
            complexity: 0
        }, params);
        if (params.complexity === 2) {
            pattern = this.generate({
                'new': params.loopCount % 8 === 1
            });
        } else {
            pattern = this.collection.get(params.complexity, 'plain');
            if (params.loopCount % 4 === 0) {
                patternBreak = this.collection.get(params.complexity, 'breaks');
                this.replace(pattern, patternBreak);
            }
            if (params.loopCount % 8 === 1) {
                this.replace(pattern, this.collection.get(params.complexity, 'crash'));
            }
        }
        return pattern;
    },
    generate: function generate(params) {
        var bars = [[], [], [], [], [], []];
        return { bars: bars };
    }
};
module.exports = exports['default'];

},{"./utils":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _rythmboxPatternGenerator = require('./rythmbox-pattern-generator');

var _rythmboxPatternGenerator2 = _interopRequireDefault(_rythmboxPatternGenerator);

var _rythmboxBufferLoader = require('./rythmbox-buffer-loader');

var _rythmboxBufferLoader2 = _interopRequireDefault(_rythmboxBufferLoader);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var state = Symbol('state');

var Rythmbox = (function () {
    function Rythmbox(params) {
        var _this = this;

        _classCallCheck(this, Rythmbox);

        this.muted = {};

        this.urls = params.urls;
        this.audioCtx = null;
        this.changeCallbacks = [];
        this[state] = _utils2['default'].dataset({
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
        } catch (e) {
            alert('Web Audio API is not supported in this browser');
        }

        this.bufferLoader = new _rythmboxBufferLoader2['default'](this.audioCtx, this.urls);
        this.bufferLoader.load().then(function (result) {
            _this.bufferList = result;
            _this.loop(true);
        })['catch'](function (err) {
            alert(err);
        });
    }

    _createClass(Rythmbox, [{
        key: 'getPattern',
        value: function getPattern() {
            return _rythmboxPatternGenerator2['default'].getPattern({
                loopCount: this[state].get('loopCount'),
                complexity: this[state].get('patternComplexity')
            });
        }
    }, {
        key: 'loop',
        value: function loop(immediately) {
            var _this2 = this;

            var pattern;
            setTimeout(function () {
                if (pattern) {
                    _this2.setState({ currentPattern: pattern });
                    var loopStartTime = _this2.audioCtx.currentTime;
                    _this2.bufferList.forEach(function (buffer, i) {
                        if (!_this2.muted[i] && pattern.bars[i]) {
                            pattern.bars[i].forEach(function (play, bar) {
                                if (play) {
                                    _this2.playChunk(buffer, bar, loopStartTime);
                                }
                            });
                        }
                    });
                    _this2.setState({ loopCount: _this2[state].get('loopCount') + 1 });
                }

                _this2.loop();
            }, immediately ? 0 : 4 * 1000 * 60 / this[state].get('tempo'));

            if (this[state].get('playing')) {
                pattern = this.getPattern();
            }
        }
    }, {
        key: 'playChunk',
        value: function playChunk(buffer, bar, startTime) {
            var source = this.audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioCtx.destination);
            source.start(startTime + bar * 15 / this[state].get('tempo'));
        }
    }, {
        key: 'play',
        value: function play() {
            this.setState({ playing: true });
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.setState({ playing: false });
        }
    }, {
        key: 'getState',
        value: function getState() {
            return this[state].get();
        }
    }, {
        key: 'setState',
        value: function setState(data) {
            var _this3 = this;

            var delta = this[state].set(data);
            Object.keys(delta).forEach(function (key) {
                _this3.changeCallbacks.forEach(function (callback) {
                    callback(key);
                });
            });
        }
    }, {
        key: 'onChange',
        value: function onChange(callback) {
            this.changeCallbacks.push(callback);
        }
    }]);

    return Rythmbox;
})();

exports['default'] = Rythmbox;
module.exports = exports['default'];

},{"./rythmbox-buffer-loader":6,"./rythmbox-pattern-generator":7,"./utils":9}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var pubSubHash = Symbol('pubSubHash');

var PubSub = (function () {
    function PubSub() {
        _classCallCheck(this, PubSub);

        this[pubSubHash] = {};
    }

    _createClass(PubSub, [{
        key: 'subscribe',
        value: function subscribe(event, callback) {
            if (!this[pubSubHash][event]) {
                this[pubSubHash][event] = [];
            }
            this[pubSubHash][event].push(callback);
        }
    }, {
        key: 'unsubscribe',
        value: function unsubscribe(event, callback) {
            var _this = this;

            if (callback === undefined) {
                this[pubSubHash][event] = [];
            } else if (this[pubSubHash][event]) {
                this[pubSubHash][event].forEach(function (value, i) {
                    if (value === callback) {
                        _this[pubSubHash][event].splice(i, 1);
                    }
                });
            }
        }
    }, {
        key: 'publish',
        value: function publish(event, data) {
            if (this[pubSubHash][event]) {
                this[pubSubHash][event].forEach(function (value) {
                    value(data);
                });
            }
        }
    }]);

    return PubSub;
})();

var observableValueCallbacks = Symbol('observableValueCallbacks');

var ObservableValue = (function () {
    function ObservableValue(value) {
        _classCallCheck(this, ObservableValue);

        this[observableValueCallbacks] = [];
        this.value = value;
    }

    _createClass(ObservableValue, [{
        key: 'set',
        value: function set(value) {
            var _this2 = this;

            this.value = value;
            this[observableValueCallbacks].forEach(function (callback) {
                callback(_this2.value);
            });
        }
    }, {
        key: 'onChange',
        value: function onChange(callback) {
            callback(this.value);
            this[observableValueCallbacks].push(callback);
        }
    }]);

    return ObservableValue;
})();

var datasetState = Symbol('datasetState');

var Dataset = (function () {
    function Dataset(params) {
        _classCallCheck(this, Dataset);

        if (params) {
            this[datasetState] = params;
        }
    }

    _createClass(Dataset, [{
        key: 'get',
        value: function get(key) {
            if (key === undefined) {
                return Object.assign({}, this[datasetState]);
            }
            return this[datasetState][key];
        }
    }, {
        key: 'set',
        value: function set(newData) {
            var _this3 = this;

            var delta = {};
            Object.keys(newData).forEach(function (key) {
                if (_this3[datasetState][key] !== newData[key]) {
                    _this3[datasetState][key] = newData[key];
                    delta[key] = newData[key];
                }
            });
            return delta;
        }
    }]);

    return Dataset;
})();

var utils = {
    random: {
        number: function number(min, max) {
            min = undefined === min ? 0 : min;
            max = undefined === max ? 1 : max;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        color: function color() {
            var color = [];
            for (var i = -1; ++i < 3;) {
                color.push(utils.random.number(0, 255));
            }
            return 'rgb(' + color.join() + ')';
        }
    },
    vectors: {
        add: function add(v1, v2) {
            return v1.map(function (value, i) {
                return value + v2[i];
            });
        },
        intersect: function intersect(v1, v2) {
            return v1.reduce(function (prev, cur) {
                return prev || v2.indexOf(cur) !== -1;
            }, false);
        }
    },
    round: function round(value, precision) {
        return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
    },
    pubsub: new PubSub(),
    angle: {
        PI: 3.1415,
        toRad: function toRad(degrees) {
            return degrees * this.PI / 180;
        },
        toDeg: function toDeg(radians) {
            return radians * 180 / this.PI;
        }
    },
    observableValue: function observableValue(value) {
        return new ObservableValue(value);
    },
    dataset: function dataset(params) {
        return new Dataset(params);
    }
};

exports['default'] = utils;
module.exports = exports['default'];

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatcherAppDispatcher = require('../dispatcher/app-dispatcher');

var _dispatcherAppDispatcher2 = _interopRequireDefault(_dispatcherAppDispatcher);

var _events = require('events');

var _libRythmbox = require('../lib/rythmbox');

var _libRythmbox2 = _interopRequireDefault(_libRythmbox);

var rythmbox = new _libRythmbox2['default']({
    tempo: 160,
    urls: ['/sounds/kick.ogg', '/sounds/snare_01.ogg', '/sounds/snare_02.ogg', '/sounds/hat_01.ogg', '/sounds/hat_02.ogg', '/sounds/hat_03.ogg', '/sounds/crash.ogg']
});

var Store = Object.assign({}, _events.EventEmitter.prototype, {
    getState: function getState() {
        return rythmbox.getState();
    },
    getBufferName: function getBufferName(id) {
        var url = rythmbox.urls[id];
        return url.split('/').pop();
    },
    addChangeListener: function addChangeListener(callback) {
        this.on('change', callback);
    },
    removeChangeListener: function removeChangeListener(callback) {
        this.removeListener('change', callback);
    },
    emitChange: function emitChange(key) {
        this.emit('change', key);
    },
    dispatcherIndex: _dispatcherAppDispatcher2['default'].register(function (action) {
        switch (action.actionType) {
            case 'setTempo':
                rythmbox.setState({ tempo: action.tempo });
                break;

            case 'setComplexity':
                rythmbox.setState({ patternComplexity: action.complexity });
                break;

            case 'togglePlay':
                if (action.on) {
                    rythmbox.play();
                } else {
                    rythmbox.stop();
                }
                break;

            case 'toggleBuffer':
                if (rythmbox.muted[action.id]) {
                    delete rythmbox.muted[action.id];
                } else {
                    rythmbox.muted[action.id] = true;
                }
                break;
        }

        return true;
    })
});

rythmbox.onChange(Store.emitChange.bind(Store));

exports['default'] = Store;
module.exports = exports['default'];

},{"../dispatcher/app-dispatcher":5,"../lib/rythmbox":8,"events":"events"}]},{},[1]);
