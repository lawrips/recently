'use strict';

const should = require('should');

let Recently = require('../lib/index');


describe('tests', () => {
    it('constructor', (done) => {
        let cache = new Recently();
        done();
    });

    it('last(num)', (done) => {
        let cache = new Recently();
        JSON.stringify(cache.last(1)).should.equal('[]');
        cache.add(1);
        cache.add(2);
        cache.add(3);
        JSON.stringify(cache.last(4)).should.equal('[1,2,3]');
        JSON.stringify(cache.last(3)).should.equal('[1,2,3]');
        JSON.stringify(cache.last(2)).should.equal('[2,3]');
        JSON.stringify(cache.last(1)).should.equal('[3]');

        cache.clear();
        let obj = [{'hello':'world'}];
        cache = new Recently(obj);
        JSON.stringify(cache.last(1)).should.equal(JSON.stringify(obj));
        done();
    });

    it('lastTime(num)', (done) => {
        let cache = new Recently();
        JSON.stringify(cache.last(1)).should.equal('[]');
        cache.add(1);
        cache.add({'hello':'world'});
        setTimeout(() => {
            cache.add(2);
            cache.add({'hello2':'world2'});
            setTimeout(() => {
                cache.add(3);
                should.not.exist(cache.lastTime(4));
                cache.lastTime(3).should.be.greaterThan(cache.lastTime(2));
                cache.lastTime(2).should.be.greaterThan(cache.lastTime(1));
                cache.lastTime({'hello2':'world2'}).should.be.greaterThan(cache.lastTime({'hello':'world'}));
                done();
            }, 10);
        }, 10);                
    });

    it('last(value, nun)', (done) => {
        let cache = new Recently();
        cache.last(true, 1).should.equal(0);
        cache.add(true);
        cache.add(true);
        cache.add(false);
        cache.add(false);
        cache.add(false);

        cache.last(true, 5).should.equal(2);
        cache.last(true, 4).should.equal(1);
        cache.last(false, 5).should.equal(3);
        cache.last(false, 2).should.equal(2);
        cache.last(false, 1).should.equal(1);

        cache.clear();
        let obj = [{'hello':'world'}];
        cache = new Recently(obj);
        cache.last(obj[0],1).should.equal(1);

        cache.clear();
        let deepObj = [{'hello':{'hello': 'world'}}];
        cache = new Recently(deepObj);
        cache.last(deepObj[0],1).should.equal(1);

        cache.clear();
        let array = ['a','b','c'];
        cache = new Recently();
        cache.add(array)
        cache.last(array,1).should.equal(1);

        done();
    });

    it('repeat test last() by passing an array in the constructor', (done) => {
        let cache = new Recently([1,2,3]);
        JSON.stringify(cache.last(4)).should.equal('[1,2,3]');
        JSON.stringify(cache.last(3)).should.equal('[1,2,3]');
        JSON.stringify(cache.last(2)).should.equal('[2,3]');
        JSON.stringify(cache.last(1)).should.equal('[3]');
        done();
    });

    it('clear()', (done) => {
        let cache = new Recently([1,2,3]);
        JSON.stringify(cache.last(4)).should.equal('[1,2,3]');
        cache.clear();
        JSON.stringify(cache.last(4)).should.equal('[]');
        cache = new Recently([1,2,3]);
        JSON.stringify(cache.last(4)).should.equal('[1,2,3]');
        done();
    });

    it('ago(seconds)', (done) => {
        let cache = new Recently();
        JSON.stringify(cache.ago(1)).should.be.equal('[]');
        cache.add(true);
        setTimeout(() => {
            cache.add(true);

            setTimeout(() => {
                JSON.stringify(cache.ago(1)).should.be.equal('[]');
                cache.add(false);
                JSON.stringify(cache.ago(1)).should.be.equal('[false]');
                JSON.stringify(cache.ago(2)).should.be.equal('[true,false]');
                JSON.stringify(cache.ago(3)).should.be.equal('[true,true,false]');
                JSON.stringify(cache.ago(4)).should.be.equal('[true,true,false]');

                cache.clear();
                let obj = [{'hello':'world'}];
                cache = new Recently(obj);
                JSON.stringify(cache.ago(1)).should.equal(JSON.stringify(obj));
                done();
                        
            }, 1500);
        }, 1000);
    });

    it('ago(value, seconds)', (done) => {
        let cache = new Recently();
        cache.add(true);
        setTimeout(() => {
            cache.add(true);

            setTimeout(() => {
                cache.ago(true, 1).should.be.equal(0);
                cache.add(false);
                cache.ago(true, 2).should.be.equal(1);
                cache.ago(true, 3).should.be.equal(2);
                cache.ago(true, 4).should.be.equal(2);
                cache.ago(false, 2).should.be.equal(1);
                cache.ago(false, 10).should.be.equal(1);


                cache.clear();
                let obj = [{'hello':'world'}];
                cache = new Recently(obj);
                cache.ago(obj[0],1).should.equal(1);

                cache.clear();
                let deepObj = [{'hello':{'hello': 'world'}}];
                cache = new Recently(deepObj);
                cache.ago(deepObj[0],1).should.equal(1);

                cache.clear();
                let array = ['a','b','c'];
                cache = new Recently();
                cache.add(array)
                cache.ago(array,1).should.equal(1);

                done();
                        
            }, 1500);
        }, 1000);
    });

    it('check maxSize in the constructor works', (done) => {
        let cache = new Recently([1,2,3], {maxSize: 3});
        JSON.stringify(cache.last(4)).should.equal('[1,2,3]');
        cache.add(4);
        JSON.stringify(cache.last(4)).should.equal('[2,3,4]');
        done();
    });
});
