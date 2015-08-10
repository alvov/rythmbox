'use strict';

import React from 'react';
import Store from '../stores/store';
import Actions from '../actions/actions';

const DIFFICULTY_LEVELS = 3;

var Controls = React.createClass({
    render() {
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
    getInitialState() {
        return { playing: Store.getState().playing };
    },
    componentDidMount() {
        Store.addChangeListener(this.onPlayStateChange);
    },
    componentWillUnmount() {
        Store.removeChangeListener(this.onPlayStateChange);
    },
    togglePlay() {
        Actions.togglePlay(!this.state.playing);
    },
    render() {
        return <button className="play-button" onClick={this.togglePlay}>{this.state.playing ? 'Stop' : 'Play'}</button>
    },
    onPlayStateChange(key) {
        if (key === 'playing') {
            this.setState({playing: Store.getState().playing});
        }
    }
});
var Tempo = React.createClass({
    getInitialState() {
        return { tempo: Store.getState().tempo };
    },
    componentDidMount() {
        Store.addChangeListener(this.onTempoChange);
    },
    componentWillUnmount() {
        Store.removeChangeListener(this.onTempoChange);
    },
    render() {
        return (
            <div className="tempo">
                <label>Tempo</label>
                <input className="tempo__input" type="range" min="120" max="170" value={this.state.tempo} onChange={this.setTempo} />
                <span className="tempo__count">{this.state.tempo}</span>
            </div>
        );
    },
    setTempo(e) {
        Actions.setTempo(Number(e.target.value));
    },
    onTempoChange(key) {
        if (key === 'tempo') {
            this.setState({ tempo: Store.getState().tempo });
        }
    }
});
var PatternComplexity = React.createClass({
    getInitialState() {
        return { complexity: Store.getState().patternComplexity };
    },
    componentDidMount() {
        Store.addChangeListener(this.onComplexityChange);
    },
    componentWillUnmount() {
        Store.removeChangeListener(this.onComplexityChange);
    },
    render() {
        var inputs = [];
        for (let i = 0; i < DIFFICULTY_LEVELS; i++) {
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
    setComplexity(e) {
        Actions.setComplexity(Number(e.target.value));
    },
    onComplexityChange(key) {
        if (key === 'patternComplexity') {
            this.setState({ complexity: Store.getState().patternComplexity });
        }
    }
});

export default Controls;