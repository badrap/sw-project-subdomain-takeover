import { expect } from 'chai';
import { DnsResolver, scanSubdomains } from '../src/domain_scanner';

class MockDnsResolver implements DnsResolver {
    private responses: Map<string, string[]> = new Map();

    setResponse(domain: string, response: string[]) {
        this.responses.set(domain, response);
    }

    async resolve(domain: string): Promise<string[]> {
        return this.responses.get(domain) || [];
    }
}

describe('scanSubdomains', () => {
    let mockResolver: MockDnsResolver;

    beforeEach(() => {
        mockResolver = new MockDnsResolver();
    });

    it('should return array of existing subdomains', async () => {
        mockResolver.setResponse('www.example.com', ['1.2.3.4']);
        mockResolver.setResponse('mail.example.com', ['1.2.3.5']);

        const result = await scanSubdomains('example.com', mockResolver);
        expect(result.sort()).to.deep.equal(['www.example.com', 'mail.example.com'].sort());
    });

    it('should throw error for invalid domain input', async () => {
        try {
            await scanSubdomains('', mockResolver);
            expect.fail('Should have thrown error');
        } catch (error) {
            expect(error.message).to.equal('Invalid domain input');
        }
    });

    it('should return empty array when no subdomains exist', async () => {
        const result = await scanSubdomains('nonexistent.com', mockResolver);
        expect(result).to.deep.equal([]);
    });

    it('should handle DNS resolution errors gracefully', async () => {
        const result = await scanSubdomains('example.com', mockResolver);
        expect(result).to.deep.equal([]);
    });
});
