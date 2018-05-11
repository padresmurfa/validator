import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('string',()=>{

        it('can compile and check a string validator', ()=>{
            let c = validator(id).string("property");

            c.check({property: "asd"});
        });

        it('only allows strings to be validated as such', ()=>{
            let c = validator(id).string("property");

            try
            {
                c.check({property: 1});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (1) to be a string");
            }
        });

        it('does not consider null a valid string', ()=>{
            let c = validator(id).string("property");
            
            try
            {
                c.check({property: null});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (<null>) to be a string");
            }
        });

        it('considers null a valid nullable string', ()=>{
            let c = validator(id).string("property").nullable();

            c.check({property: null});
        });

        it('considers undefined a valid optional string', ()=>{
            let c = validator(id).string("property").optional();
            
            c.check({property: undefined});
        });
    });
});
