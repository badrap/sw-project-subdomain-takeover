/* List of domains is based on EdOverflow's "Can I take over xyz" project's data about vulnerable domains */
/* Currently only includes Azure domains. 

TODO: Load list of domains from can-i-take-over-xyz fingerprints.json */
const list_of_domain: string[][] = [
    [".cloudapp.net", "vulnerable"],
    [".cloudapp.azure.com", "vulnerable"],
    [".azurewebsites.net", "vulnerable"],
    [".blob.core.windows.net", "vulnerable"],
    [".cloudapp.azure.com", "vulnerable"],
    [".azure-api.net", "vulnerable"],
    [".azurehdinsight.net", "vulnerable"],
    [".azureedge.net", "vulnerable"],
    [".azurecontainer.io", "vulnerable"],
    [".database.windows.net", "vulnerable"],
    [".azuredatalakestore.net", "vulnerable"],
    [".search.windows.net", "vulnerable"],
    [".azurecr.io", "vulnerable"],
    [".redis.cache.windows.net", "vulnerable"],
    [".azurehdinsight.net", "vulnerable"],
    [".servicebus.windows.net", "vulnerable"],
    [".visualstudio.com", "vulnerable"]
]

export function matchDomain(domain: string) {
    /* Check if a domain is listed as vulnerable in Can I Takeover XYZ listing */ 
    
    /* regex from: https://stackoverflow.com/questions/10306690/what-is-a-regular-expression-which-will-match-a-valid-domain-name-without-a-subd by user Andrew Domaszek */
    const checkIfValidDomain = new RegExp("^(?=.{1,253}\.?$)(?:(?!-|[^.]+_)[A-Za-z0-9-_]{1,63}(?<!-)(?:\.|$)){2,}$");

    if (!checkIfValidDomain.test(domain)) {
        return -1;
    }

    for (let d of list_of_domain) {
        if (domain.match(d[0]))
            return 1;
    }

    return 0;

}