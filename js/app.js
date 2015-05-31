'use strict';

var React = require('react');
var SamplesTimeline = require('./components/samples-timeline');
var Controls = require('./components/controls');

React.render(
    <SamplesTimeline />,
    document.getElementById('visuals')
);

React.render(
    <Controls />,
    document.getElementById('controls')
);
