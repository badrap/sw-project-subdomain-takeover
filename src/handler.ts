import * as ha from "../src/heuristic_analysis";
import * as fqdn from "../src/fqdm_analysis";
import { parse } from 'tldts'

export async function getDomainDetails(domain: string) {

    let isWebServer = await ha.checkForAnyWebServer("https",domain).then((token) => { return token })
    let isOnlineWebServer =  await ha.checkForOnlineWebServer("https",domain).then((token) => { return token })
    let FQDN_Analysis = await fqdn.checkFQDM(domain).then((token) => { return token })
    let status = getStatus(FQDN_Analysis)

        
    let result =  ha.matchDomain(domain) == -1? "Inconclusive": 
    {
            isVulnerable: ha.matchDomain(domain) == 1? "Yes": "No",
            isServer: ha.pingServer? "Yes":"No",
            isWebServer: isWebServer == 1? "Yes": "Inconclusive",
            isOnlineWebServer:isOnlineWebServer == 1? "Yes": "Inconclusive",
            FQDN_Analysis: FQDN_Analysis,
            parsedDomain:parse(domain),
            status: status,
            subdomainDetails: this.getDomainDetails(parse(domain).subdomain)
    }

    return result
}

    function getStatus(FQDN_Analysis): string {
        // let isDangling = await ha.checkForFingerprint(domain).then((token) => { return token });
        if (FQDN_Analysis.expired) return "Takeoverable"
        else if (ha.matchDomain(FQDN_Analysis) == 1) return "At Risk"
        // else if (isDangling.dangling) return "Dangling"
        else return "Not vulnerable to dangling"
    }
  