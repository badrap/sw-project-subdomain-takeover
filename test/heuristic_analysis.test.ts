/* To run this test:  mocha --reporter spec test/heuristic_analysis.test.ts */ 
import * as ha from "../src/heuristic_analysis";
import * as mocha from 'mocha';
import * as chai from 'chai';

var assert = chai.assert;

describe('Pattern matching test for heuristic analysis module', () => {

    it('Empty and incorrect domain names test', () => {
        assert.equal(ha.matchDomain("") , -1);
        assert.equal(ha.matchDomain("a") , -1);
    });

    it('Vulnerability not detected', () => {
        assert.equal(ha.matchDomain("abc.elb.amazonaws.com") , 0);
        assert.equal(ha.matchDomain("abc.newcloudapp.net") , 0);
    });

    it('Vulnerability detected (Azure domain)', () => {
        assert.equal(ha.matchDomain("testning.cloudapp.net") , 1);
        assert.equal(ha.matchDomain("testning.uniqueid1203752.region.cloudapp.net") , 1);
    });

    it('Vulnerability detected', () => {
        assert.equal(ha.matchDomain("test.surveysparrow.com") , 1);
    });

});

describe('Testing if there is a webserver or not', () => {

    it('No webserver found', () => {
       // assert.equal(ha.checkForWebServer("test.local"), 0);
        return ha.checkForWebServer("test.local").then(result => {
            assert.equal(result, 0);
        });
    });

    it('Webserver found', () => {
        //assert.equal(ha.checkForWebServer("scholar.google.com"), 1);
        return ha.checkForWebServer("scholar.google.com").then(result => {
            assert.equal(result, 1);
        });
    });


});

