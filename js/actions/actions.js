'use strict';

var AppDispatcher = require('../dispatcher/app-dispatcher');
var Actions = {
    togglePlay: function(on) {
        AppDispatcher.dispatch({
            actionType: 'togglePlay',
            on: on
        });
    },
    toggleBuffer: function(id) {
        AppDispatcher.dispatch({
            actionType: 'toggleBuffer',
            id: id
        });
    },
    setTempo: function(tempo) {
        AppDispatcher.dispatch({
            actionType: 'setTempo',
            tempo: tempo
        });
    },
    setComplexity: function(complexity) {
        AppDispatcher.dispatch({
            actionType: 'setComplexity',
            complexity: complexity
        });
    }
};

module.exports = Actions;