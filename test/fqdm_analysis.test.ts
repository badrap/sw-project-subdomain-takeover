import * as fqdm from '../src/fqdm_analysis';
import * as mocha from 'mocha';
import * as chai from 'chai';

var assert = chai.assert;

describe('FQDM analysis test', () => {
    it('Empty and incorrect domain names test', () => {
        assert.equal(fqdm.checkFQDM('bbc.co.uk'), -1);
    });
});
