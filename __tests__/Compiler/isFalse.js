import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('isFalse',()=>{
        
        it('can compile and check an isFalse validator', ()=>{
            let c = validator(id).isFalse("property");

            c.check({property: false});
        });
        
        it('can compile and check a failing isFalse validator', ()=>{
            let c = validator(id).isFalse("property");

            try
            {
                c.check({property: true});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (true) to be false");
            }
        });
    });
});
