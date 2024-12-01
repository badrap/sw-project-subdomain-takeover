/* This module includes tests for the Fully Qualified Domain Name to check that it isn't dangling or about to be dangling. */

import * as whoisParsed from 'whois-parsed';

export async function checkFQDM(domain: string) {
  const result = await whoisParsed.lookup(domain);
  console.log(JSON.stringify(result, null, 2));
}
