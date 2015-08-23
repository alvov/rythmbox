'use strict';

import React from 'react';
import Store from '../stores/store';
import Actions from '../actions/actions';
import constants from '../constants/constants';

var Controls = React.createClass({
    getInitialState() {
        return { loading: Store.getState('loading') };
    },
    componentDidMount() {
        Store.addChangeListener(this.onLoadingStateChange);
    },
    componentWillUnmount() {
        Store.removeChangeListener(this.onLoadingStateChange);
    },
    render() {
        return (
            <div className={'controls' + (this.state.loading ? ' loading' : '')}>
                <PlayButton />
                <Tempo />
                <PatternComplexity />
            </div>
        );
    },
    onLoadingStateChange(key) {
        if (key === 'loading') {
            this.setState({ loading: Store.getState('loading') });
        }
    }
});

var RangeControl = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        min: React.PropTypes.number,
        max: React.PropTypes.number,
        value: React.PropTypes.number,
        onchange: React.PropTypes.func.isRequired,
        postfix: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            min: 0,
            max: 100,
            value: 0,
            postfix: ''
        };
    },
    render() {
        return (
            <div className="control">
                <label className="control__label">{this.props.name}</label>
                <input className="control__input" type="range" min={this.props.min} max={this.props.max} value={this.props.value} onChange={this.props.onchange} />
                <span className="control__postfix">{this.props.postfix}</span>
            </div>
        );
    }
});

var PlayButton = React.createClass({
    getInitialState() {
        return { playing: Store.getState('playing') };
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
            this.setState({ playing: Store.getState('playing') });
        }
    }
});
var Tempo = React.createClass({
    getInitialState() {
        return { tempo: Store.getState('tempo') };
    },
    componentDidMount() {
        Store.addChangeListener(this.onTempoChange);
    },
    componentWillUnmount() {
        Store.removeChangeListener(this.onTempoChange);
    },
    render() {
        return <RangeControl
            name="Tempo"
            min={120}
            max={170}
            value={this.state.tempo}
            onchange={this.setTempo}
            postfix={String(this.state.tempo)} />;
    },
    setTempo(e) {
        Actions.setTempo(Number(e.target.value));
    },
    onTempoChange(key) {
        if (key === 'tempo') {
            this.setState({ tempo: Store.getState('tempo') });
        }
    }
});
var PatternComplexity = React.createClass({
    getInitialState() {
        return this.getCurrentComplexity();
    },
    componentDidMount() {
        Store.addChangeListener(this.onComplexityChange);
    },
    componentWillUnmount() {
        Store.removeChangeListener(this.onComplexityChange);
    },
    render() {
        return <RangeControl
            name="Complexity"
            min={0}
            max={constants.COMPLEXITY_LEVELS - 1}
            value={this.state.complexity}
            onchange={this.setComplexity}
            postfix={this.state.complexityName} />;
    },
    setComplexity(e) {
        Actions.setComplexity(Number(e.target.value));
    },
    onComplexityChange(key) {
        if (key === 'patternComplexity') {
            this.setState(this.getCurrentComplexity());
        }
    },
    getCurrentComplexity() {
        var result = {
            complexity: Store.getState('patternComplexity')
        };
        result.complexityName = constants.COMPLEXITY_NAME[result.complexity];
        return result;
    }
});

export default Controls;