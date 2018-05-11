import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('optional',()=>{

        it('can compile and check an optional validator', ()=>{
            let c = validator(id).integer("property").optional();
            
            c.check({property: 1});
        });

        it('allows optional args to be undefined', ()=>{
            let c = validator(id).integer("property").optional();
            
            c.check({property: undefined});
        });
 
        it('does not consider null a valid expression of optionality', ()=>{
            let c = validator(id).integer("property").optional();
            
            try
            {
                c.check({property: null});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (<null>) to be an integer");
            }
        });
    });
});
