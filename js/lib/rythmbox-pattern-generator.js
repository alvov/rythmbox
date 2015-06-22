'use strict';

var utils = require('./utils');
var objectAssign = require('object-assign');

var Collection = function() {
    var collection = {
        0: {
            plain: [
                { bars: [
                    '1000000010000000',
                    '0000100000001000',
                    '0000000000000010',
                    '0010001000100010',
                    '1010101010101010',
                    '0101000010001000'
                ] },
                { bars: [
                    '1000000010000000',
                    '0000101000001000',
                    '0000000000000010',
                    '0010001000100010',
                    '1010101010101010',
                    '0101000010001000'
                ] }
            ],
            breaks: [
                { bars: [
                    '10000',
                    '00011',
                    '00100'
                ], merge: true },
                { bars: [
                    '10100',
                    '',
                    '',
                    '',
                    '',
                    '00100'
                ], merge: true },
                { bars: [
                    '10010000',
                    '00001101',
                    '00100000',
                    '00101010',
                    '10100101',
                    '10010000'
                ] },
                { bars: [
                    '1001001000100000',
                    '0000100100001110',
                    '0000000001000000',
                    '0010001000100010',
                    '1010101010101110',
                    '0101000001010000'
                ] }
            ],
            filters: []
        },
        1: {
            plain: [
                { bars: [
                    '1000000000100100',
                    '0000100000001000',
                    '0000000101000000',
                    '0010001000100010',
                    '1000000000100100',
                    '0101010011010011'
                ] },
                { bars: [
                    '1000000000100010',
                    '0000100100001100',
                    '0000001001000000',
                    '0010001000100010',
                    '1000100000100010',
                    '0101010101010101'
                ] },
                { bars: [
                    '1000000000100000',
                    '0000100001001001',
                    '0000000100000000',
                    '0010001001001010',
                    '1000100010000001',
                    '0101010010010101'
                ] },
                { bars: [
                    '1001000000100000',
                    '0000100100001000',
                    '0000001001000000',
                    '0010001001000100',
                    '1001000100100010',
                    '0100010010010001'
                ] }
            ],
            breaks: [
                { bars: [
                    '1010000000100000',
                    '0000100100001111',
                    '0100000001000000',
                    '0010001000100010',
                    '1010000010100010',
                    '0100100101000101'
                ] },
                { bars: [
                    '10010100',
                    '01001011',
                    '00100000',
                    '10010010',
                    '01000010',
                    '00011100'
                ] },
                { bars: [
                    '1010001001110100',
                    '0000100100001000',
                    '0000010000000011',
                    '0010001000001010',
                    '1000000100001000',
                    '0101010110000000'
                ] },
                { bars: [
                    '100100100',
                    '000001001',
                    '001010010',
                    '001001001',
                    '100100100',
                    '010010010'
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
                        return Object.keys(Object(samplePattern)).map(function(i) {
                            return Number(samplePattern[i]);
                        });
                    }),
                    merge: source.merge
                }
            }
            return result;
        }
    }
};

var patternGenerator = {
    collection: new Collection(),
    replace: function(source, newPattern) {
        var startPoint = source.bars[0].length - newPattern.bars[0].length;
        var merge = Boolean(newPattern.merge);
        source.bars.forEach(function(samplePattern, i) {
            if (newPattern.bars[i]) {
                newPattern.bars[i].forEach(function(newBar, j) {
                    if (!merge || newBar) {
                        samplePattern[j + startPoint] = newBar;
                    }
                });
            }
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
            pattern = this.replace(pattern, patternBreak);
        }
        return pattern;
    }
};

module.exports = patternGenerator;