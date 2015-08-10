'use strict';

import Collection from './rythmbox-collection';
import utils from '../utils';

const PATTERN_SIZE = 16;

export default {
    basicGeneratedPattern: null,
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
                            source.bars[i] = new Array(PATTERN_SIZE).fill(0);
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
        }
        if (params.loopCount % 8 === 1) {
            this.replace(pattern, this.collection.get(params.complexity, 'crash'));
        }
        return pattern;
    },
    generate(params) {
        var result = {
            bars: []
        };
        for (let i = 0; i < 6; i++) {
            result.bars.push(new Array(PATTERN_SIZE).fill(0));
        }
        if (params.new || !this.basicGeneratedPattern) {
            this.generateBasic();
        }
        // kick + snare
        this.replace(result, this.basicGeneratedPattern);
        result.bars[1].forEach((bar, i) => {
            if (
                i + 1 < PATTERN_SIZE &&
                bar &&
                utils.random.number(0, 1)
            ) {
                result.bars[0][i + 1] = 1;
            }
        });
        if (!utils.random.number(0, 5)) {
            result.bars[0][0] = 0;
        }
        if (result.bars[1][12]) {
            let variant = utils.random.number(0, 2);
            switch (variant) {
                case 0:
                    if (!result.bars[0][9]) {
                        result.bars[1][9] = 1;
                    }
                    break;
                case 1:
                    result.bars[1][13] = 1;
            }
        }
        if (!result.bars[1][4] && utils.random.number(0, 2)) {
            result.bars[1][3] = 1;
        }

        // second snare
        var secondSnare = [];
        if (result.bars[1][12]) {
            secondSnare.push(9);
        }
        for (let i = 0; i < 2; i++) {
            secondSnare.push(utils.random.number(0, 15));
        }
        secondSnare.forEach(bar => {
            if (!result.bars[0][bar] && !result.bars[1][bar]) {
                result.bars[2][bar] = 1;
            }
        });

        // open hi-hat
        let i = 2;
        do {
            result.bars[3][i] = 1;
            i += utils.random.number(2, 4);
        } while (i < PATTERN_SIZE);

        // tamb
        result.bars[4][0] = 1;
        i = 3;
        do {
            if (!result.bars[3][i]) {
                result.bars[4][i] = 1;
            }
            i += utils.random.number(2, 4);
        } while (i < PATTERN_SIZE);

        // closed hi-hat
        for (i = 0; i < PATTERN_SIZE; i++) {
            if (i % 2) {
                let shift = utils.random.number([-1, 0, 0, 0, 1]);
                if (i + shift < PATTERN_SIZE) {
                    result.bars[5][i + shift] = 1;
                }
            }
        }

        return result;
    },
    generateBasic() {
        var kick = new Array(PATTERN_SIZE).fill(0);
        kick[0] = 1;
        kick[utils.random.number([2, 8, 9, 11, 14])] = 1;

        var snare = new Array(PATTERN_SIZE).fill(0);
        snare[utils.random.number([4, 6])] = 1;
        if (snare[4]) {
            snare[utils.random.number([10, 12])] = 1;
        } else {
            snare[12] = 1;
        }
        this.basicGeneratedPattern = { bars: [kick, snare], merge: true };
    }
};
