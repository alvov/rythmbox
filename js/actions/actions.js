'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
export default {
    togglePlay(on) {
        AppDispatcher.dispatch({
            actionType: 'togglePlay',
            on
        });
    },
    toggleBuffer(id) {
        AppDispatcher.dispatch({
            actionType: 'toggleBuffer',
            id
        });
    },
    setTempo(tempo) {
        AppDispatcher.dispatch({
            actionType: 'setTempo',
            tempo
        });
    },
    setComplexity(complexity) {
        AppDispatcher.dispatch({
            actionType: 'setComplexity',
            complexity
        });
    }
};
