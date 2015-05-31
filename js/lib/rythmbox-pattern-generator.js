'use strict';

var utils = require('./utils');
var objectAssign = require('object-assign');

var Collection = function() {
    var collection = {
        0: {
            plain: [
                { bars: [
                    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
                ] },
                { bars: [
                    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1]
                ] },
                { bars: [
                    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
                ] },
                { bars: [
                    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
                ] }
            ],
            breaks: [
                { bars: [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1]
                ] },
                { bars: [
                    [1, 0, 0],
                    [0, 1, 1]
                ] }
            ],
            filters: []
        },
        1: {
            plain: [
                { bars: [
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
                ] },
                { bars: [
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0]
                ] }
            ],
            breaks: [
                { bars: [
                    [1, 0],
                    [0, 1]
                ] }
            ]
        }
    };
    return {
        get: function(difficulty, category) {
            var source = collection[difficulty];
            if (source === undefined) {
                source = collection[Math.max.apply(null, Object.keys(this.collection))];
            }
            source = source[category];
            var result = source;
            if (category !== 'filter') {
                source = source[utils.random.number(0, source.length - 1)];
                result = {
                    bars: source.bars.map(function(samplePattern) {
                        return samplePattern.slice(0);
                    })
                }
            }
            return result;
        }
    }
};

var patternGenerator = {
    collection: new Collection(),
    replace: function(source, newPattern, params) {
        var startPoint = 0;
        params = objectAssign({
            place: 'start',
            merge: false
        }, params);
        if (params.place === 'end') {
            startPoint = source.bars[0].length - newPattern.bars[0].length
        }
        source.bars.forEach(function(samplePattern, i) {
            newPattern.bars[i].forEach(function(newBar, j) {
                if (!params.merge || newBar) {
                    samplePattern[j + startPoint] = newBar;
                }
            });
        });
        return source;
    },
    getPattern: function(params) {
        var pattern;
        var patternBreak;
        params = objectAssign({
            loopCount: 1,
            difficulty: 0
        }, params);
        pattern = this.collection.get(params.difficulty, 'plain');
        if (params.loopCount % 4 === 0) {
            patternBreak = this.collection.get(params.difficulty, 'breaks');
            pattern = this.replace(pattern, patternBreak, { place: 'end' });
        }
        return pattern;
    }
};

module.exports = patternGenerator;