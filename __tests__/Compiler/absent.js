import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('absent',()=>{

        it('can compile and check an absent validator', ()=>{
            c = validator(id).string("property").absent();

            c.check({property: undefined});
        });
        
        it('only allows present props to be validated as required', ()=>{
            let c = validator(id).string("daProp").absent();

            try
            {
                c.check({daProp: "asd"});
                assume.fail("Validator.check did not cause an assumption failure");
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/daProp: Expected value (\"asd\") to be undefined");
            }
        });
    });
});
