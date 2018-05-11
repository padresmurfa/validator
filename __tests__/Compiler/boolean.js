import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('boolean',()=>{

        it('can compile and check a boolean validator', ()=>{
            let c = validator(id).boolean("property");

            c.check({property: true});
        });

        it('only allows booleans to be validated as such', ()=>{
            let c = validator(id).boolean("property");

            try
            {
                c.check({property: "false"});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (\"false\") to be a boolean");
            }
        });

        it('does not consider null a valid boolean', ()=>{
            let c = validator(id).boolean("property");

            try
            {
                c.check({property: null});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (<null>) to be a boolean");
            }
        });

        it('considers null a valid nullable boolean', ()=>{
            let c = validator(id).boolean("property").nullable();

            c.check({property: null});
        });

        it('considers undefined a valid optional boolean', ()=>{
            let c = validator(id).boolean("property").optional();
            
            c.check({property: undefined});
        });
    });
});
