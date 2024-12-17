import * as ha from '../src/heuristic_analysis';
import { parse } from 'tldts';

export function getThreatScore(domain: string) {
    return ha.matchDomain(domain) == -1
        ? -1
        : {
              isVulnerable: ha.matchDomain(domain) == 1 ? 'Yes' : 'No',
              isServer: ha.pingServer ? 'Yes' : 'No',
              isWebServer: ha.checkForAnyWebServer('https', domain)
                  ? 'Yes'
                  : ha.checkForAnyWebServer('http', domain)
                    ? 'Yes'
                    : 'No',
              parsedDomain: parse(domain),
          };
}
