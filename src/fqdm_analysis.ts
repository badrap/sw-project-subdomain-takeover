/* This module includes tests for the Fully Qualified Domain Name to check that it isn't dangling or about to be dangling. */

import * as whoisParsed from 'whois-parsed';

/**
 * Checks the Fully Qualified Domain Name (FQDM) to ensure it isn't dangling or about to be dangling.
 * @param {string} domain - The domain name to check.
 */
export async function checkFQDM(domain: string) {
    const result = await whoisParsed.lookup(domain);
    console.log(JSON.stringify(result, null, 2));
    // TODO: The function currently does not return any value, making it difficult to test.
}
