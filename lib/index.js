'use strict';

const _ = require('lodash');

class Recently {
    constructor(array, options) {
        if (array && Array.isArray(array)) {
            // create a starting array if it set
            this.cache = [];
            array.forEach((item) => {
                this.add(item);
            })
        }
        else {
            // otherwise just initialize as empty
            this.cache = [];
        }

        // set options if present
        if (options && options.maxSize) {
            this.maxSize = options.maxSize;
        }
    }

    clear() {
        this.cache = [];
    }

    add(item) {
        let epoc = new Date().getTime();
        var obj = {};
        obj[epoc] = item
        
        // if there is a max size set, shift the array
        if (this.maxSize) {
            this.cache = this.cache.slice(1);
        }
        this.cache.push(obj);
    }

    last(value, num) {
        // value is optional. if present, pass to other method 
        if (num != null) return this._lastWithCompare(value, num);

        // if not present, shift and continue
        num = value; 

        let cache = JSON.parse(JSON.stringify(this.cache));
        if (num <= this.cache.length) {
            cache = cache.slice(this.cache.length - num);
        }

        return cache.length > 0 ? cache.map((item) => Object.keys(item).map((key) => item[key])).reduce((a,b) => a.concat(b)) : [];        
    }

    ago(value, seconds) {
        // if not present, shift and continue
        var compareValue = true;
        if (seconds == null) {
            seconds = value;
            compareValue = false;
        }

        // if a value was sent for comparison, we compare and return the length
        if (compareValue) return this._agoWithCompare(value, seconds).length;
        
        // otherwise send back the full array
        let result = this._agoWithCompare(null, seconds);
        return result.length > 0 ? result.map((item) => Object.keys(item).map((key) => item[key])).reduce((a,b) => a.concat(b)) : [];        
    }

    _agoWithCompare(value, seconds) {
        let epoc = new Date(new Date() - seconds * 1000).getTime();
        let cache = JSON.parse(JSON.stringify(this.cache));

        return cache.filter((obj) => {
            let matched = false;
            for (var key in obj) {
                if (key >= epoc) {
                    if (value != null && (value === obj[key] || (_isObject(value) && _.isEqual(value, obj[key])))) {
                        matched = true;        
                    }
                    else if (value == null) {
                        matched = true;
                    }
                }
            }
            return matched;
        });
    }

    _lastWithCompare(value, num) {            
        let cache = JSON.parse(JSON.stringify(this.cache));

        if (num <= this.cache.length) {
            cache = cache.slice(this.cache.length - num);
        }

        // the number of occurences
        return cache.filter((obj) => {
            let matched = false;
            for (var key in obj) {
                if (value === obj[key] || (_isObject(value) && _.isEqual(value, obj[key]))) {
                    matched = true;        
                }
            }
            return matched;
        }).length;
    }
}

function _isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}

module.exports = Recently;