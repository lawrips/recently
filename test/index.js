'use strict';

const should = require('should');

let Recent = require('../lib/index');


describe('tests', () => {
    it('count items from the last n', (done) => {
        let cache = new Recent();
        cache.add(true);
        cache.add(true);
        cache.add(false);
        cache.add(false);
        cache.add(false);

        cache.countLast(true, 5).should.equal(2);
        cache.countLast(true, 4).should.equal(1);
        cache.countLast(false, 5).should.equal(3);
        cache.countLast(false, 2).should.equal(2);
        cache.countLast(false, 1).should.equal(1);
        done();
    });

    it('count items from the last seconds', (done) => {
        let cache = new Recent();
        cache.add(true);
        setTimeout(() => {
            cache.add(true);

            setTimeout(() => {
                cache.add(false);

                cache.countTime(true, 2).should.be.equal(1);
                cache.countTime(true, 3).should.be.equal(2);
                cache.countTime(true, 4).should.be.equal(2);
                cache.countTime(false, 2).should.be.equal(1);
                cache.countTime(false, 10).should.be.equal(1);

                done();
                        
            }, 1500);
        }, 1000);
    });

    it('test getLast', (done) => {
        let cache = new Recent();
        cache.add(1);
        cache.add(2);
        cache.add(3);
        JSON.stringify(cache.last(4)).should.equal('[1,2,3]');
        JSON.stringify(cache.last(3)).should.equal('[1,2,3]');
        JSON.stringify(cache.last(2)).should.equal('[2,3]');
        JSON.stringify(cache.last(1)).should.equal('[3]');
        done();
    });
});
