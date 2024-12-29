import dns from 'dns';
import { promisify } from 'util';

export interface DnsResolver {
    resolve(domain: string): Promise<string[]>;
}

export class RealDnsResolver implements DnsResolver {
    private dnsResolve = promisify(dns.resolve);

    async resolve(domain: string): Promise<string[]> {
        try {
            await this.dnsResolve(domain);
            return [domain];
        } catch {
            return [];
        }
    }
}

export async function scanSubdomains(domain: string, resolver: DnsResolver = new RealDnsResolver()): Promise<string[]> {
    if (!domain || typeof domain !== 'string') {
        throw new Error('Invalid domain input');
    }

    const commonSubdomains = [
        'www',
        'mail',
        'drive',
        'calendar',
        'docs',
        'cloud',
        'api',
        'dev',
        'staging',
        'test',
        'admin',
        'blog',
        'shop',
        'store',
        'support',
    ];

    const scanPromises = commonSubdomains.map(async (prefix) => {
        const subdomain = `${prefix}.${domain}`;
        const results = await resolver.resolve(subdomain);
        return results.length > 0 ? subdomain : null;
    });

    const scannedResults = await Promise.all(scanPromises);
    return scannedResults.filter((subdomain): subdomain is string => subdomain !== null);
}

// Usage example:
// async function main() {
//     try {
//         const subdomains = await scanSubdomains('google.com');
//         console.log('Found subdomains:', subdomains);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }
