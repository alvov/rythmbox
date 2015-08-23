'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import { EventEmitter } from 'events';
import Rythmbox from '../lib/rythmbox/rythmbox';
import { actionTypes } from '../constants/constants';

var rythmbox = new Rythmbox({
    tempo: 160,
    urls: [
        './sounds/kick.ogg',
        './sounds/snare_01.ogg',
        './sounds/snare_02.ogg',
        './sounds/hat_01.ogg',
        './sounds/hat_02.ogg',
        './sounds/hat_03.ogg',
        './sounds/crash.ogg'
    ]
});

var Store = Object.assign({}, EventEmitter.prototype, {
    getState(key) {
        if (rythmbox[key] !== undefined) {
            return rythmbox[key];
        } else {
            return rythmbox.getState()[key];
        }
    },
    getBufferName(id) {
        var url = rythmbox.urls[id];
        return url.split('/').pop();
    },
    addChangeListener(callback) {
        this.on('change', callback);
    },
    removeChangeListener(callback) {
        this.removeListener('change', callback);
    },
    emitChange() {
        this.emit('change', ...arguments);
    },
    dispatcherIndex: AppDispatcher.register(action => {
        switch(action.actionType) {
            case actionTypes.SET_TEMPO:
                rythmbox.setState({ tempo: action.tempo });
                break;

            case actionTypes.SET_COMPLEXITY:
                rythmbox.setState({ patternComplexity: action.complexity });
                break;

            case actionTypes.TOGGLE_PLAY:
                if (action.on) {
                    rythmbox.play();
                } else {
                    rythmbox.stop();
                }
                break;

            case actionTypes.TOGGLE_BUFFER:
                if (rythmbox.muted[action.id]) {
                    delete rythmbox.muted[action.id];
                } else {
                    rythmbox.muted[action.id] = true;
                }
                break;
        }

        return true;
    })
});

rythmbox.onChange(Store.emitChange.bind(Store));

export default Store;