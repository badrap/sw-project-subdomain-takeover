/* To run this test:  mocha --reporter spec test/heuristic_analysis.test.ts */
import * as ha from "../src/heuristic_analysis" 
import * as mocha from 'mocha'
import * as chai from 'chai'

var assert = chai.assert;

describe('Pattern matching test for heuristic analysis module', () => {

    it('Empty and incorrect domain names test', () => {
        assert.equal(ha.matchDomain("") , -1);
        assert.equal(ha.matchDomain("a") , -1);
    });

    it('Vulnerability not detected', () => {
        assert.equal(ha.matchDomain("abc.elb.amazonaws.com") , 0);
    });

    it('Vulnerability detected (Azure domain)', () => {
        assert.equal(ha.matchDomain("testning.cloudapp.net") , 1);
    });

});

