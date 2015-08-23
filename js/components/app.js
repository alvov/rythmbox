'use strict';

import React from 'react';
import Controls from './controls';
import SamplesTimeline from './samples-timeline';
import LoadingScreen from './loading-screen';

var RythmboxApp = React.createClass({
    render() {
        return (
            <div>
                <Controls />
                <SamplesTimeline />
                <LoadingScreen />
            </div>
        );
    }
});

export default RythmboxApp;