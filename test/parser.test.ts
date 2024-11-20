/* To run this test:  mocha --reporter spec test/parser.test.ts */ 
import * as parser from "../src/parsertld" 
import * as chai from 'chai'

var assert = chai.assert;

describe('Test for Parser module', () => {

    it('Get Subdomain test', () => {
        assert.equal(parser.getSubDomain("sub.example.com") , 'sub');
    });
    it('Get Domain test', () => {
        assert.equal(parser.getDomain("sub.example.com") , 'example.com');
    });
    it('Get Domain without Suffix test', () => {
        assert.equal(parser.getDomainWithoutSuffix("sub.example.com") , 'example');
    });
    it('Get Public Suffix test', () => {
        assert.equal(parser.getPublicSuffix("sub.example.com") , 'com');
    });
    it('Is ICAAN test', () => {
        assert.equal(parser.isIcann("sub.example.com") , true);
    });
    it('Is IP test', () => {
        assert.equal(parser.isIp("sub.example.com") , false);
    });
    it('Is Private test', () => {
        assert.equal(parser.isPrivate("sub.example.com") , false);
    });
    it('Get Hostname test', () => {
        assert.equal(parser.getHostname("sub.example.com") , 'sub.example.com');
    });

});

