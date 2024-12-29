/* To run this test:  mocha --reporter spec test/heuristic_analysis.test.ts */
import * as ha from '../src/heuristic_analysis';
import * as mocha from 'mocha';
import * as chai from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import sinon from 'sinon';
import ping from 'ping';

var assert = chai.assert;

describe('Pattern matching test for heuristic analysis module', () => {
    it('Empty and incorrect domain names test', () => {
        assert.equal(ha.matchDomain(''), -1);
        assert.equal(ha.matchDomain('a'), -1);
    });

    it('Parser should allow valid domains', () => {
        assert.equal(ha.matchDomain('xn--c1yn36fstackoverflow.com'), 0);
        assert.equal(ha.matchDomain('stackoverflow.xn--c1yn36fcom'), 0);
        assert.equal(ha.matchDomain('p.co'), 0);
    });

    it('Vulnerability not detected', () => {
        assert.equal(ha.matchDomain('abc.elb.amazonaws.com'), 0);
        assert.equal(ha.matchDomain('abc.newcloudapp.net'), 0);
    });

    it('Vulnerability detected (Azure domain)', () => {
        assert.equal(ha.matchDomain('testning.cloudapp.net'), 1);
        assert.equal(ha.matchDomain('testning.uniqueid1203752.region.cloudapp.net'), 1);
    });

    it('Vulnerability detected', () => {
        assert.equal(ha.matchDomain('test.surveysparrow.com'), 1);
    });
});

describe('Testing if there is a webserver or not', () => {
    let mockAxios: MockAdapter;
    let pingStub: sinon.SinonStub;

    beforeEach(() => {
        mockAxios = new MockAdapter(axios);
        pingStub = sinon.stub(ping.promise, 'probe');
    });

    afterEach(() => {
        mockAxios.restore();
        pingStub.restore();
    });

    it('No webserver found', async () => {
        // Or we can also use axios.defaults.timeout = 4000;
        mockAxios.onGet().timeout();

        const result = await ha.checkForOnlineWebServer('https', 'test.local');
        assert.equal(result, 0);
    });

    it('Webserver found', async () => {
        mockAxios.onGet().reply(200);

        const result = await ha.checkForOnlineWebServer('https', 'scholar.google.com');
        assert.equal(result, 1);
    });

    it('No server found with echo', () => {
        pingStub.withArgs('172.0.0.2').resolves({ alive: false });
        return ha.pingServer('172.0.0.2').then((result) => {
            assert.equal(result, false);
        });
    });

    it('Server found with echo', () => {
        pingStub.withArgs('8.8.8.8').resolves({ alive: true });
        return ha.pingServer('8.8.8.8').then((result) => {
            assert.equal(result, true);
        });
    });
});

describe('Check for Fingerprint', () => {
    it('Check for fingerprint test DANGLING NXDOMAIN', () => {
        //Very flakey
        return ha.checkForFingerprint('uusitestivapaa.azurewebsites.net').then((result) => {
            assert.equal(result.dangling, true);
        });
    });

    it('Check for fingerprint test not dangling but offline', () => {
        //Very flakey
        return ha.checkForFingerprint('uusi.azurewebsites.net').then((result) => {
            assert.equal(result.dangling, false);
        });
    });

    it('Check for fingerprint test DANGLING OTHER FINGERPRINT', () => {
        //Very flakey
        return ha.checkForFingerprint('aaa.bitbucket.io').then((result) => {
            assert.equal(result.dangling, true);
        });
    });

    it('Check for fingerprint test not dangling', () => {
        //Very flakey
        return ha.checkForFingerprint('dretools.bitbucket.io').then((result) => {
            assert.equal(result.dangling, false);
        });
    });
});
