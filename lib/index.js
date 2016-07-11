'use strict';

class Recent {
    constructor(array) {
        if (!array) {
            this.cache = [];
        }
    }

    set(array) {
        // todo
    }

    add(item) {
        let epoc = new Date().getTime();
        var obj = {};
        obj[epoc] = item
        this.cache.push(obj);
    }

    last(num) {
        let cache = JSON.parse(JSON.stringify(this.cache));
        if (num <= this.cache.length) {
            cache = cache.slice(this.cache.length - num);
        }
             
        return cache.map((item) => Object.keys(item).map((key) => item[key]) ).reduce((a,b) => a.concat(b));
    }

    countTime(value, seconds) {
        let epoc = new Date(new Date() - seconds * 1000).getTime();
        let cache = JSON.parse(JSON.stringify(this.cache));

        return cache.filter((obj) => {
            let matched = false;
            for (var key in obj) {
                if (key >= epoc && value === obj[key]) {
                    matched = true;        
                }
            }
            return matched;
        }).length;
    }


    countLast(value, num) {
        // true if there are x occurrences of value from last y items in array 
        // var array = [true, true, false, true, false]
        // xInLast(array, 'false', 2, 3) 
        // returns true;
        let cache = JSON.parse(JSON.stringify(this.cache));

        if (num <= this.cache.length) {
            cache = cache.slice(this.cache.length - num);
        }

        // the number of occurences
        return cache.filter((obj) => {
            let matched = false;
            for (var key in obj) {
                if (value === obj[key]) {
                    matched = true;        
                }
            }
            return matched;
        }).length;
    }
}

module.exports = Recent;