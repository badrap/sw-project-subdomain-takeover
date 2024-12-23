/* To run this test:  mocha --reporter spec test/handler.test.ts */ 
import * as ha from "../src/handler";
import * as chai from 'chai';

var assert = chai.assert;

describe('Pattern matching test for handler', () => {

    it('Empty and incorrect domain name test', () => {
        assert.equal(ha.getDomainDetails("") , -1);
    });
    it('Correct domain name test', () => {
        console.log(ha.getDomainDetails("stackoverflow.xn--c1yn36fcom"));
        assert.equal(ha.getDomainDetails("stackoverflow.xn--c1yn36fcom") , -1);
    });

});