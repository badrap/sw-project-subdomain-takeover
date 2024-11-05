/* List of domains is based on EdOverflow's "Can I take over xyz" project's data about vulnerable domains */
/* Currently only includes Azure domains. 

TODO: Load list of domains from can-i-take-over-xyz fingerprints.json */

import * as listOfDomains from "./fingerprints.json";
import axios from "axios";

function seekDomain(cname: string[], domain: string) {
    if (cname.length == 0){
        return 0;}

        let rvalue = 0;

        //TODO: Needs some other way to crawl through the list. Now loops through the full list without breaking when a positive result found. I tried returning out of the function, but the forEach function loop eats the return.
    cname.forEach(function (name) {
        //This needed for weeding out false positives.
        name = "."+name;
        //console.log(name + " " + domain + " " + domain.indexOf(name));
        
        if (domain.indexOf(name) > -1) {
            rvalue = 1;
            }
        })

    return rvalue;
}

export function matchDomain(domain: string) {
    /*  Check if a domain is listed as vulnerable in Can I Takeover XYZ listing 
        Domain string should alteast have a leading dot or the the subdomain tree, like .example.com to mark the FQDN cutoff point to weed out false positives.
    */ 
    
    /* regex from: https://stackoverflow.com/questions/10306690/what-is-a-regular-expression-which-will-match-a-valid-domain-name-without-a-subd by user Andrew Domaszek */
    const checkIfValidDomain = new RegExp("^(?=.{1,253}\.?$)(?:(?!-|[^.]+_)[A-Za-z0-9-_]{1,63}(?<!-)(?:\.|$)){2,}$");

    if (!checkIfValidDomain.test(domain)) {
        return -1;
    }

    let rvalue = 0;

   listOfDomains.forEach(function (d) {
        if (seekDomain(d.cname, domain) == 1){
            //console.log(d.vulnerable);
            if (d.status == "Vulnerable") {
                rvalue = 1;
            }
        }
    })

    //console.log(rvalue);
    return rvalue;

}

export async function checkForWebServer(domain: string) {
    /* Checks if there is a web server answering from a given domain. */
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let value: number = -1;
    domain = "https://" + domain;
    try {
        const response = await axios.get(domain);
        //await delay(1950);
        if (response.status <= 500) {
            value = 1;
        } else {
            value = 0;
        }
    } catch (error) {
        value = 0;
    } finally {
        //console.log(value);
        return value;
    }
}