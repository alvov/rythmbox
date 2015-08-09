'use strict';

import React from 'react';
import Store from '../stores/store';
import Actions from '../actions/actions';

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
    render() {
        return <div className="cursor" style={{left: this.state.cursorPos + '%'}} />;
    },
    interval: null,
    reset(tempo) {
        var i = 0;
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            i++;
            this.setState({ cursorPos: i * 100 / 16 });
            if (i === 16) {
                clearInterval(this.interval);
                this.interval = null;
                this.setState({ cursorPos: 0 });
            }
        }, 1000 * 15 / tempo);
        this.setState({ cursorPos: 0 });
    }
});
var SamplesTimeline = React.createClass({
    getInitialState() {
        return { pattern: Store.getState().currentPattern };
    },
    componentDidMount() {
        Store.addChangeListener(this.onStateChange);
    },
    componentWillUnmount() {
        Store.removeChangeListener(this.onStateChange);
    },
    render() {
        var samplesLines = this.state.pattern.bars.map(
            (samplePattern, i) => <SampleTimeline id={i} samplePattern={samplePattern}/>
        );
        return (
            <div className="box clearfix">
                <TimelineCursor ref="cursor" />
                {samplesLines}
            </div>
        );
    },
    onStateChange(key) {
        if (key === 'currentPattern') {
            let rythmBoxState = Store.getState();
            this.setState({ pattern: rythmBoxState.currentPattern });
            this.refs.cursor.reset(rythmBoxState.tempo);
        }
    }
});

export default SamplesTimeline;