/* List of domains is based on EdOverflow's "Can I take over xyz" project's data about vulnerable domains */
/* Currently only includes Azure domains.

TODO: Load list of domains from can-i-take-over-xyz fingerprints.json */

import * as listOfDomains from './fingerprints.json';
import axios from 'axios';
import ping from 'ping';

/**
 * Seeks the domain in the list of CNAMEs.
 * @param {string[]} cname - List of CNAMEs.
 * @param {string} domain - The domain to check.
 * @returns {number} - 1 if the domain is found, otherwise 0.
 */
function seekDomain(cname: string[], domain: string): number {
    if (cname.length == 0) {
        return 0;
    }

    //TODO: Needs some other way to crawl through the list. Now loops through the full list without breaking when a positive result found. I tried returning out of the function, but the forEach function loop eats the return.
    for (const name of cname) {
        if (domain.includes(`.${name}`)) {
            return 1;
        }
    }

    return 0;
}

/**
 * Matches the domain against a list of known vulnerable domains.
 * @param {string} domain - The domain to check.
 * @returns {number} - 1 if the domain is vulnerable, 0 if not, -1 if invalid.
 */
export function matchDomain(domain: string): number {
    let parsedDomain: string;
    try {
        parsedDomain = new URL('https://' + domain).hostname;
        if (!parsedDomain || parsedDomain.split('.').length < 2) {
            return -1;
        }
    } catch (error) {
        return -1;
    }

    for (const d of listOfDomains) {
        if (seekDomain(d.cname, parsedDomain) === 1 && d.status === 'Vulnerable') {
            return 1;
        }
    }

    return 0;
}

/**
 * Checks if there is a web server answering from a given domain.
 * @param {string} protocol - The protocol to use (http or https).
 * @param {string} domain - The domain to check.
 * @returns {Promise<number>} - 1 if a web server is found, otherwise 0.
 */
export async function checkForOnlineWebServer(protocol: string, domain: string): Promise<number> {
    /* Checks if there is a web server answering from a given domain. */
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    let value: number = -1;
    const url = `${protocol}://${domain}`;

    try {
        const response = await axios.get(url);
        // await delay(1950);
        value = response.status <= 500 ? 1 : 0;
    } catch (error) {
        value = 0;
    } finally {
        //console.log(value);
        return value;
    }
}

/**
 * Checks if there is a web server answering from a given domain.
 * @param {string} protocol - The protocol to use (http or https).
 * @param {string} domain - The domain to check.
 * @returns {Promise<number>} - 1 if a web server is found, otherwise 0.
 */
export async function checkForAnyWebServer(protocol: string, domain: string): Promise<number> {
    /* Checks if there is a web server answering from a given domain. */
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    let value: number = -1;
    const url = `${protocol}://${domain}`;

    try {
        await axios.get(url);
        // await delay(1950);
        //value = response.status <= 500 ? 1 : 0;
        value = 1;
    } catch (error) {
        value = 0;
    } finally {
        //console.log(value);
        return value;
    }
}

/**
 * Pings a server to check if it is alive.
 * @param {string} server - The server to ping.
 * @returns {Promise<boolean>} - True if the server is alive, otherwise false.
 */
export async function pingServer(server: string): Promise<boolean> {
    // Function from: https://medium.com/@abhipillai/how-to-ping-ip-address-using-typescript-565105b7f6fa
    try {
        const response = await ping.promise.probe(server);
        return response.alive ? true : false;
    } catch (error) {
        console.error('Error in pinging: ' + error);
        return false;
    }
}

/**
 *
 **/
export async function checkForFingerprint(domain: string): Promise<{ dangling: Boolean; error: String }> {
    let result = {
        dangling: false,
        error: '',
    };
    let parsedDomain: string;

    try {
        parsedDomain = new URL('https://' + domain).hostname;
        if (!parsedDomain || parsedDomain.split('.').length < 2) {
            result.error = 'Not a domain';
            //console.log(result.error);
            return result;
        }
    } catch (error) {
        result.error = 'Domain parsing failed with an error ' + error;
        //console.log(result.error);
        return result;
    }

    let fingerprint;

    for (const d of listOfDomains) {
        if (seekDomain(d.cname, parsedDomain) === 1) {
            fingerprint = d.fingerprint;
            break;
        }
    }

    if (fingerprint == 'NXDOMAIN') {
        try {
            const getResult = await axios.get('https://' + parsedDomain);
            if (!getResult.data && getResult.data.length === 0) {
                result.dangling = true;
            }
        } catch (error) {
            //console.log(error);
            if (error.code == 'ENOTFOUND') result.dangling = true;
        }
    } else {
        try {
            const getResult = await axios.get('https://' + parsedDomain);
            if (JSON.stringify(getResult.data).includes(fingerprint)) result.dangling = true;
        } catch (error) {
            if (error.response.data.includes(fingerprint)) result.dangling = true;
            result.error = error;
        }
    }

    return result;
}
