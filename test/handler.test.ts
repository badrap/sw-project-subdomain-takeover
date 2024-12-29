/* To run this test:  mocha --reporter spec test/handler.test.ts */ 
import * as ha from "../src/handler";
import * as chai from 'chai';

var assert = chai.assert;

describe('Pattern matching test for handler', () => {
    
    it('Correct domain name test', () => {

        try {
            ha.getDomainDetails("stackoverflow.xn--c1yn36fcom").then((result) => {  
                !assert.equal(result,"Inconclusive")
            });        
          
            
        } catch (error) {
            console.error(error) 
        }
    });

});