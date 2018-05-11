import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('date',()=>{

        it('can compile and check a date validator', ()=>{
            let c = validator(id).date("property");

            c.check({property: new Date()});
        });

        it('only allows dates to be validated as such', ()=>{
            let c = validator(id).date("property");

            try
            {
                c.check({property: "false"});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (\"false\") to be a date");
            }
        });
        
        it('does not consider null a valid date', ()=>{
            let c = validator(id).date("property");

            try
            {
                c.check({property: null});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (<null>) to be a date");
            }
        });

        it('considers null a valid nullable date', ()=>{
            let c = validator(id).date("property").nullable();

            c.check({property: null});
        });

        it('considers undefined a valid optional date', ()=>{
            let c = validator(id).date("property").optional();

            c.check({property: undefined});
        });
    });
});
