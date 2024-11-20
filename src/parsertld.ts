import { parse } from 'tldts'

function callParse(url: string){ 
    console.log(parse(url));   
    return parse(url);
}

export function getSubDomain(url: string) {
    return callParse(url).subdomain
}

export function getDomain(url: string) {
    return callParse(url).domain
}

export function getDomainWithoutSuffix(url: string) {
    return callParse(url).domainWithoutSuffix
}

export function getHostname(url: string) {
    return callParse(url).hostname
}

export function isIcann(url: string) {
    return callParse(url).isIcann
}

export function isIp(url: string) {
    return callParse(url).isIp
}

export function isPrivate(url: string) {
    return callParse(url).isPrivate
}

export function getPublicSuffix(url: string) {
    return callParse(url).publicSuffix
}

