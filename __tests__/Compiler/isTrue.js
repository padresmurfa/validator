import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('isTrue',()=>{
        
        it('can compile and check an isTrue validator', ()=>{
            let c = validator(id).isTrue("property");

            c.check({property: true});
        });
        
        it('can compile and check a failing isTrue validator', ()=>{
            let c = validator(id).isTrue("property");

            try
            {
                c.check({property: false});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (false) to be true");
            }
        });        
    });
});
