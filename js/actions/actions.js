'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import { actionTypes } from '../constants/constants';

export default {
    togglePlay(on) {
        AppDispatcher.dispatch({
            actionType: actionTypes.TOGGLE_PLAY,
            on
        });
    },
    toggleBuffer(id) {
        AppDispatcher.dispatch({
            actionType: actionTypes.TOGGLE_BUFFER,
            id
        });
    },
    setTempo(tempo) {
        AppDispatcher.dispatch({
            actionType: actionTypes.SET_TEMPO,
            tempo
        });
    },
    setComplexity(complexity) {
        AppDispatcher.dispatch({
            actionType: actionTypes.SET_COMPLEXITY,
            complexity
        });
    }
};
