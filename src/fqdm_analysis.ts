/* This module includes tests for the Fully Qualified Domain Name to check that it isn't dangling or about to be dangling. */

import * as whoisParsed from 'whois-parsed';

/**
 * Checks the Fully Qualified Domain Name (FQDM) to ensure it isn't dangling or about to be dangling.
 * @param {string} domain - The domain name to check.
 */
export async function checkFQDM(
    domain: string,
): Promise<{ err; errInfo; domain_registered; expired; expiring_soon; domain_bot_controlled }> {
    let result = {
        err: false,
        errInfo: '',
        domain_registered: false,
        expired: false,
        expiring_soon: false,
        domain_bot_controlled: false,
    };

    try {
        const whoisResult = await whoisParsed.lookup(domain);

        const whoisTime = Date.parse(whoisResult.expirationDate);

        if (whoisTime <= Date.now()) {
            result.expired = true;
            result.expiring_soon = true;
        } else if (whoisTime <= Date.now() + 2629746000) {
            result.expiring_soon = true;
        }
    } catch (error) {
        result.err = true;
        result.errInfo = error;
        return result;
    }
}
