import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('integer',()=>{

        it('can compile and check a integer validator', ()=>{
            let c = validator(id).integer("property");
            
            c.check({property: 1});
        });

        it('only allows integers to be validated as such', ()=>{
            let c = validator(id).integer("property");
            
            try
            {
                c.check({property: "1"});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (\"1\") to be an integer");
            }
        });

        it('does not consider null a valid integer', ()=>{
            let c = validator(id).integer("property");

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

        it('considers null a valid nullable integer', ()=>{
            let c = validator(id).integer("property").nullable();
            
            c.check({property: null});
        });

        it('considers undefined a valid optional integer', ()=>{
            let c = validator(id).integer("property").optional();

            c.check({property: undefined});
        });
    });
});
