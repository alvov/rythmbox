'use strict';

import utils from './utils';

var collection = {
    0: {
        plain: [
            {
                bars: [
                    '1000000010000000',
                    '0000100000001000',
                    '0000000000000010',
                    '0010001000100010',
                    '1010101010101010',
                    '0101000010001000'
                ]
            },
            {
                bars: [
                    '1000000010000000',
                    '0000101000001000',
                    '0000000000000010',
                    '0010001000100010',
                    '1010101010101010',
                    '0101000010001000'
                ]
            }
        ],
        breaks: [
            {
                bars: [
                    '10000',
                    '00011',
                    '00100'
                ],
                merge: true
            },
            {
                bars: [
                    '10100',
                    '',
                    '',
                    '',
                    '',
                    '00100'
                ],
                merge: true
            },
            {
                bars: [
                    '10010000',
                    '00001101',
                    '00100000',
                    '00101010',
                    '10100101',
                    '10010000'
                ]
            },
            {
                bars: [
                    '1001001000100000',
                    '0000100100001110',
                    '0000000001000000',
                    '0010001000100010',
                    '1010101010101110',
                    '0101000001010000'
                ]
            }
        ],
        filters: [],
        crash: [
            {
                bars: [
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '1'
                ],
                merge: true,
                startPoint: 0
            }
        ]
    },
    1: {
        plain: [
            {
                bars: [
                    '1000000000100100',
                    '0000100000001000',
                    '0000000101000000',
                    '0010001000100010',
                    '1000000000100100',
                    '0101010011010011'
                ]
            },
            {
                bars: [
                    '1000000000100010',
                    '0000100100001100',
                    '0000001001000000',
                    '0010001000100010',
                    '1000100000100010',
                    '0101010101010101'
                ]
            },
            {
                bars: [
                    '1000000000100000',
                    '0000100001001001',
                    '0000000100000000',
                    '0010001001001010',
                    '1000100010000001',
                    '0101010010010101'
                ]
            },
            {
                bars: [
                    '1001000000100000',
                    '0000100100001000',
                    '0000001001000000',
                    '0010001001000100',
                    '1001000100100010',
                    '0100010010010001'
                ]
            }
        ],
        breaks: [
            {
                bars: [
                    '1010000000100000',
                    '0000100100001111',
                    '0100000001000000',
                    '0010001000100010',
                    '1010000010100010',
                    '0100100101000101'
                ]
            },
            {
                bars: [
                    '10010100',
                    '01001011',
                    '00100000',
                    '10010010',
                    '01000010',
                    '00011100'
                ]
            },
            {
                bars: [
                    '1010001001110100',
                    '0000100100001000',
                    '0000010000000011',
                    '0010001000001010',
                    '1000000100001000',
                    '0101010110000000'
                ]
            },
            {
                bars: [
                    '100100100',
                    '000001001',
                    '001010010',
                    '001001001',
                    '100100100',
                    '010010010'
                ]
            }
        ],
        crash: [
            {
                bars: [
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '1'
                ],
                merge: true,
                startPoint: 0
            }
        ]
    }
};

class Collection {
    get(complexity, category) {
        var source = collection[complexity];
        if (source === undefined) {
            source = collection[Math.max(...Object.keys(collection))];
        }
        source = source[category];
        var result = source;
        if (category !== 'filter') {
            if (source.length > 1) {
                source = source[utils.random.number(0, source.length - 1)];
            } else {
                source = source[0];
            }
            result = {
                bars: source.bars.map(samplePattern =>
                    Object.keys(samplePattern).map(i => Number(samplePattern[i]))
                ),
                merge: source.merge,
                startPoint: source.startPoint
            }
        }
        return result;
    }
}

export default {
    collection: new Collection(),
    replace(source, newPattern) {
        var startPoint = newPattern.startPoint !== undefined ?
            newPattern.startPoint :
            source.bars[0].length - newPattern.bars[0].length;
        var merge = Boolean(newPattern.merge);
        newPattern.bars.forEach((newSamplePattern, i) => {
            if (newSamplePattern) {
                newSamplePattern.forEach((newBar, j) => {
                    if (!merge || newBar) {
                        if (!source.bars[i]) {
                            source.bars[i] = new Array(16).fill(0);
                        }
                        source.bars[i][j + startPoint] = newBar;
                    }
                });
            }
        });
    },
    getPattern(params) {
        var pattern;
        var patternBreak;
        params = Object.assign({
            loopCount: 1,
            complexity: 0
        }, params);
        if (params.complexity === 2) {
            pattern = this.generate({
                new: params.loopCount % 8 === 1
            });
        } else {
            pattern = this.collection.get(params.complexity, 'plain');
            if (params.loopCount % 4 === 0) {
                patternBreak = this.collection.get(params.complexity, 'breaks');
                this.replace(pattern, patternBreak);
            }
            if (params.loopCount % 8 === 1) {
                this.replace(pattern, this.collection.get(params.complexity, 'crash'));
            }
        }
        return pattern;
    },
    generate(params) {
        var bars = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
        return { bars };
    }
};
