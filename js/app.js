'use strict';

import React from 'react';
import SamplesTimeline from './components/samples-timeline';
import Controls from './components/controls';

React.render(
    <SamplesTimeline />,
    document.getElementById('visuals')
);

React.render(
    <Controls />,
    document.getElementById('controls')
);
