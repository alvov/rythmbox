'use strict';

var pubSubHash = Symbol('pubSubHash');
class PubSub {
    constructor() {
        this[pubSubHash] = {};
    }

    subscribe(event, callback) {
        if (!this[pubSubHash][event]) {
            this[pubSubHash][event] = [];
        }
        this[pubSubHash][event].push(callback);
    }

    unsubscribe(event, callback) {
        if (callback === undefined) {
            this[pubSubHash][event] = [];
        } else if (this[pubSubHash][event]) {
            this[pubSubHash][event].forEach((value, i) => {
                if (value === callback) {
                    this[pubSubHash][event].splice(i, 1);
                }
            });
        }
    }

    publish(event, data) {
        if (this[pubSubHash][event]) {
            this[pubSubHash][event].forEach(value => {
                value(data);
            });
        }
    }
}

var observableValueCallbacks = Symbol('observableValueCallbacks');
class ObservableValue {
    constructor(value) {
        this[observableValueCallbacks] = [];
        this.value = value;
    }

    set(value) {
        this.value = value;
        this[observableValueCallbacks].forEach(callback => {
            callback(this.value);
        });
    }

    onChange(callback) {
        callback(this.value);
        this[observableValueCallbacks].push(callback);
    }
}

var datasetState = Symbol('datasetState');
class Dataset {
    constructor(params) {
        if (params) {
            this[datasetState] = params;
        }
    }
    get(key) {
        if (key === undefined) {
            return Object.assign({}, this[datasetState]);
        }
        return this[datasetState][key];
    }
    set(newData) {
        var delta = {};
        Object.keys(newData).forEach(key => {
            if (this[datasetState][key] !== newData[key]) {
                this[datasetState][key] = newData[key];
                delta[key] = newData[key];
            }
        });
        return delta;
    }
}

var utils = {
    random: {
        number(min = 0, max = 1) {
            if (Array.isArray(min)) {
                return min[this.number(0, min.length - 1)];
            } else {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        },
        color() {
            var color = [];
            for (let i = -1; ++i < 3;) {
                color.push(utils.random.number(0, 255));
            }
            return 'rgb(' + color.join() + ')';
        }
    },
    vectors: {
        add(v1, v2) {
            return v1.map((value, i) => value + v2[i]);
        },
        intersect(v1, v2) {
            return v1.reduce((prev, cur) => prev || v2.indexOf(cur) !== -1, false);
        }
    },
    round(value, precision) {
        return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
    },
    pubsub: new PubSub(),
    angle: {
        PI: 3.1415,
        toRad(degrees) {
            return degrees * this.PI / 180;
        },
        toDeg(radians) {
            return radians * 180 / this.PI;
        }
    },
    observableValue(value) {
        return new ObservableValue(value);
    },
    dataset(params) {
        return new Dataset(params);
    }
};

export default utils;
