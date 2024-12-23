import * as ha from "../src/heuristic_analysis";
import * as fqdn from "../src/fqdm_analysis";
import { parse } from 'tldts'

export async function getDomainDetails(domain: string) {
    
    return ha.matchDomain(domain) == -1? "Inconclusive": 
    {
            isVulnerable: ha.matchDomain(domain) == 1? "Yes": "No",
            isServer: ha.pingServer? "Yes":"No",
            isWebServer: await ha.checkForAnyWebServer("https",domain) == 1? "Yes": "Inconclusive",
            isOnlineWebServer: await ha.checkForOnlineWebServer("https",domain) == 1? "Yes": "Inconclusive",
            FQDN_Analysis: fqdn.checkFQDM(domain),
            parsedDomain:parse(domain),
            status: await getStatus(domain),
            subdomainDetails: this.getDomainDetails(parse(domain).subdomain)
    }

    async function getStatus(domain: string): Promise<string> {
        let isDangling = await ha.checkForFingerprint(domain);
        let fqdnAnalysis = await fqdn.checkFQDM(domain);
        if (fqdnAnalysis.expired) return "Takeoverable"
        else if (ha.matchDomain(domain) == 1) return "At Risk"
        else if (isDangling.dangling) return "Dangling"
        else return "Not vulnerable to dangling"
    }
    
}