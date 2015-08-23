'use strict';

import React from 'react';
import Store from '../stores/store';
import Actions from '../actions/actions';
import constants from '../constants/constants';

var SampleBar = React.createClass({
    render() {
        var className = `bar ${this.props.className}`;
        return <div className={className} />;
    }
});
var TimelineToggle = React.createClass({
    render() {
        return <button className="toggle" onClick={this.props.onclick}>{this.props.children}</button>
    }
});
var SampleTimeline = React.createClass({
    propTypes: {
        samplePattern: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
    },
    getInitialState() {
        return {
            name: '',
            muted: false
        };
    },
    componentDidMount() {
        this.setState({ name: Store.getBufferName(this.props.id) });
    },
    render() {
        var bars = this.props.samplePattern.map(play => {
            let barClass = play ? 'fill' : 'empty';
            return <SampleBar className={barClass} />;
        });
        return (
            <div className={'line' + (this.state.muted ? ' muted' : '')}>
                <TimelineToggle onclick={this.toggle}>{this.state.name}</TimelineToggle>
                {bars}
            </div>
        );
    },
    toggle() {
        this.setState({ muted: !this.state.muted });
        Actions.toggleBuffer(this.props.id);
    }
});
var TimelineCursor = React.createClass({
    getInitialState() {
        return { cursorPos: 0 }
    },
    componentDidMount() {
        Store.addChangeListener(this.onBarChange);
    },
    componentWillUnmount() {
        Store.removeChangeListener(this.onBarChange);
    },
    render() {
        return <div className="cursor" style={{left: this.state.cursorPos + '%'}} />;
    },
    getPosition(bar) {
        return bar * 100 / constants.BARS;
    },
    onBarChange(key, bar) {
        if (key === 'bar') {
            this.setState({ cursorPos: this.getPosition(bar) });
        }
    }
});
var SamplesTimeline = React.createClass({
    getInitialState() {
        return { pattern: Store.getState('currentPattern') };
    },
    componentDidMount() {
        Store.addChangeListener(this.onPatternChange);
    },
    componentWillUnmount() {
        Store.removeChangeListener(this.onPatternChange);
    },
    render() {
        var samplesLines = this.state.pattern.bars.map(
            (samplePattern, i) => <SampleTimeline id={i} samplePattern={samplePattern}/>
        );
        return (
            <div className="box clearfix">
                <TimelineCursor />
                {samplesLines}
            </div>
        );
    },
    onPatternChange(key) {
        if (key === 'pattern') {
            this.setState({ pattern: Store.getState('currentPattern') });
        }
    }
});

export default SamplesTimeline;