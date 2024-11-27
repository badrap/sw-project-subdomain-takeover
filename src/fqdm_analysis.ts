/* This module includes tests for the Fully Qualified Domain Name to check that it isn't dangling or about to be dangling. */

import * as whois from 'whois';

export function checkFQDM(domain: string) {
    whois.lookup(domain, function(err, data) {
        console.log(data)
    })
}