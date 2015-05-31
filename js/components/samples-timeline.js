'use strict';

var React = require('react');
var Store = require('../stores/store');
var Actions = require('../actions/actions');

var SampleBar = React.createClass({
    render: function() {
        var className = ['bar', this.props.className].join(' ');
        return <div className={className} />;
    }
});
var TimelineToggle = React.createClass({
    render: function() {
        return <button className="toggle" onClick={this.props.onclick}>{this.props.children}</button>
    }
});
var SampleTimeline = React.createClass({
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
            return <SampleBar className={barClass} />;
        });
        return (
            <div className={'line' + (this.state.muted ? ' muted' : '')}>
                <TimelineToggle onclick={this.toggle}>{this.state.name}</TimelineToggle>
                {bars}
            </div>
        );
    },
    toggle: function() {
        this.setState({ muted: !this.state.muted });
        Actions.toggleBuffer(this.props.id);
    }
});
var TimelineCursor = React.createClass({
    getInitialState: function() {
        return { cursorPos: 0 }
    },
    render: function() {
        return <div className="cursor" style={{left: this.state.cursorPos + '%'}} />;
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
var SamplesTimeline = React.createClass({
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
            return <SampleTimeline id={i} samplePattern={samplePattern}/>;
        });
        return (
            <div className="box clearfix">
                <TimelineCursor ref="cursor" />
                {samplesLines}
            </div>
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