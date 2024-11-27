import * as ha from "../src/heuristic_analysis";
import { parse } from 'tldts'

export function getThreatScore(domain: string) {
    return ha.matchDomain(domain) == -1? -1: 
    {
            isVulnerable: ha.matchDomain(domain) == 1? "Yes": "No",
            isServer: ha.pingServer? "Yes":"No",
            isWebServer: ha.checkForWebServer("https",domain)?"Yes": ha.checkForWebServer("http",domain)?"Yes":"No",
            parsedDomain:parse(domain)    
    }
    
}