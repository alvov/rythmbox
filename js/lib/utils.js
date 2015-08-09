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

var utils = {
    extend() {
        var l = arguments.length;
        var result = arguments[0];
        var key;
        for (let i = 0; ++i < l;) {
            if (typeof arguments[i] === 'object') {
                for (key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        result[key] = arguments[i][key];
                    }
                }
            }
        }
        return result;
    },
    random: {
        number(min, max) {
            min = undefined === min ? 0 : min;
            max = undefined === max ? 1 : max;
            return Math.floor(Math.random() * (max - min + 1)) + min;
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
        intersect(v1, v2){
            return v1.reduce((prev, cur) => prev || v2.indexOf(cur) !== -1, false);
        }
    },
    round(value, precision){
        return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
    },
    pubsub: new PubSub(),
    angle: {
        PI: 3.1415,
        toRad(degrees){
            return degrees * this.PI / 180;
        },
        toDeg(radians){
            return radians * 180 / this.PI;
        }
    },
    observableValue(value){
        return new ObservableValue(value);
    }
};

export default utils;
