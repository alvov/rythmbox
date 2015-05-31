'use strict';

var React = require('react');
var Store = require('../stores/store');
var Actions = require('../actions/actions');

var DIFFICULTY_LEVELS = 2;

var Controls = React.createClass({
    render: function() {
        return (
            <div className="controls">
                <PlayButton />
                <Tempo />
                <PatternComplexity />
            </div>
        );
    }
});
var PlayButton = React.createClass({
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
        return <button className="play-button" onClick={this.togglePlay}>{this.state.playing ? 'Stop' : 'Play'}</button>
    },
    onPlayStateChange: function(key) {
        if (key === 'playing') {
            this.setState({playing: Store.getState().playing});
        }
    }
});
var Tempo = React.createClass({
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
            <div className="tempo">
                <label>Tempo</label>
                <input className="tempo__input" type="range" min="120" max="170" value={this.state.tempo} onChange={this.setTempo} />
                <span className="tempo__count">{this.state.tempo}</span>
            </div>
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
var PatternComplexity = React.createClass({
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
                <input type="radio" name="complexity"
                    key={i} id={'complexity' + i} value={i} onChange={this.setComplexity}
                    checked={Number(this.state.complexity) === i} />
            );
        }
        return (
            <div className="complexity">
                <label>Complexity</label>
                {inputs}
            </div>
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