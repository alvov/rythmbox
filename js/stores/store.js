'use strict';

import AppDispatcher from '../dispatcher/app-dispatcher';
import { EventEmitter } from 'events';
import RythmBox from '../lib/rythmbox';

var rythmBox = new RythmBox({
    tempo: 160,
    urls: [
        '/sounds/kick.ogg',
        '/sounds/snare_01.ogg',
        '/sounds/snare_02.ogg',
        '/sounds/hat_01.ogg',
        '/sounds/hat_02.ogg',
        '/sounds/hat_03.ogg',
        '/sounds/crash.ogg'
    ]
});

var Store = Object.assign({}, EventEmitter.prototype, {
    getState() {
        return rythmBox.state.get();
    },
    getBufferName(id) {
        var url = rythmBox.urls[id];
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
                rythmBox.state.set('tempo', action.tempo);
                break;

            case 'setComplexity':
                rythmBox.state.set('patternComplexity', action.complexity);
                break;

            case 'togglePlay':
                if (action.on) {
                    rythmBox.play();
                } else {
                    rythmBox.stop();
                }
                break;

            case 'toggleBuffer':
                if (rythmBox.muted[action.id]) {
                    delete rythmBox.muted[action.id];
                } else {
                    rythmBox.muted[action.id] = true;
                }
                break;
        }

        return true;
    })
});

rythmBox.onChange(Store.emitChange.bind(Store));

export default Store;