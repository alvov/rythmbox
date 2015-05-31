'use strict';

var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventEmitter = require('events').EventEmitter;
var RythmBox = require('../lib/rythmbox');
var objectAssign = require('object-assign');

var rythmBox = new RythmBox({
    tempo: 160,
    urls: [
        '/sounds/kick.ogg',
        '/sounds/snare.ogg'
    ]
});

var Store = objectAssign({}, EventEmitter.prototype, {
    getState: function() {
        return rythmBox.state.get();
    },
    getBufferName: function(id) {
        var url = rythmBox.urls[id];
        return url.split('/').pop();
    },
    addChangeListener: function(callback) {
        this.on('change', callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },
    emitChange: function(key) {
        this.emit('change', key);
    },
    dispatcherIndex: AppDispatcher.register(function(action) {
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

module.exports = Store;