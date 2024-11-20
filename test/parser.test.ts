/* To run this test:  mocha --reporter spec test/parser.test.ts */ 
import * as parser from "../src/parsertld" 
import * as chai from 'chai'

var assert = chai.assert;

describe('Test for Parser module', () => {

    it('Get subdomain test', () => {
        assert.equal(parser.getSubDomain("sub.example.com") , 'sub');
    });
    it('Get domain test', () => {
        assert.equal(parser.getHostname("sub.example.com") , 'sub');
    });
    it('Is ICAAN test', () => {
        assert.equal(parser.getHostname("sub.example.com") , 'sub');
    });
    it('Get domain test', () => {
        assert.equal(parser.getHostname("sub.example.com") , 'sub');
    });

});

