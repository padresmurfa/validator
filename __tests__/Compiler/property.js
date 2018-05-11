import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('property',()=>{

        it('can compile and check a property validator', ()=>{
            let c = validator(id).property("property");
            
            c.check({property: true});
        });

        it('defines properties as required by default', ()=>{
            let c = validator(id).property("property");
            
            try
            {
                c.check({property: undefined});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value to be defined");
            }
        });        
    });
});
