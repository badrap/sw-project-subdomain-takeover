/* List of domains is based on EdOverflow's "Can I take over xyz" project's data about vulnerable domains */
/* Currently only includes Azure domains.

TODO: Load list of domains from can-i-take-over-xyz fingerprints.json */

import * as listOfDomains from "./fingerprints.json";
import axios from "axios";

function seekDomain(cname: string[], domain: string) {
    if (cname.length == 0){
        return 0;
    }

    //TODO: Needs some other way to crawl through the list. Now loops through the full list without breaking when a positive result found. I tried returning out of the function, but the forEach function loop eats the return.
    for (const name of cname) {
        if (domain.indexOf("." + name) > -1) {
            return 1;
        }
    }

    return 0;
}

export function matchDomain(domain: string) {
    let parsedDomain: string;
    try {
        parsedDomain = new URL("https://" + domain).hostname;
        if (!parsedDomain || parsedDomain.split('.').length < 2) {
            return -1;
        }
    } catch (error) {
        return -1;
    }

    for (const d of listOfDomains) {
        if (seekDomain(d.cname, parsedDomain) === 1 && d.status === "Vulnerable") {
            return 1;
        }
    }

    return 0;
}

export async function checkForWebServer(domain: string) {
    /* Checks if there is a web server answering from a given domain. */
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    let value: number = -1;
    const url = `https://${domain}`;

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