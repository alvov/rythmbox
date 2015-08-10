'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import { EventEmitter } from 'events';
import Rythmbox from '../lib/rythmbox/rythmbox';

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
    getState() {
        return rythmbox.getState();
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
    emitChange(key) {
        this.emit('change', key);
    },
    dispatcherIndex: AppDispatcher.register(action => {
        switch(action.actionType) {
            case 'setTempo':
                rythmbox.setState({ tempo: action.tempo });
                break;

            case 'setComplexity':
                rythmbox.setState({ patternComplexity: action.complexity });
                break;

            case 'togglePlay':
                if (action.on) {
                    rythmbox.play();
                } else {
                    rythmbox.stop();
                }
                break;

            case 'toggleBuffer':
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