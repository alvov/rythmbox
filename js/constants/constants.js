'use strict';

import constants from '../lib/rythmbox/rythmbox-constants';

export default Object.assign({
    actionTypes: {
        TOGGLE_PLAY: 'togglePlay',
        TOGGLE_BUFFER: 'toggleBuffer',
        SET_TEMPO: 'setTempo',
        SET_COMPLEXITY: 'setComplexity'
    }
}, constants);
