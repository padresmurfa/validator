import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('isoDate',()=>{

        it('can compile and check a isoDate validator', ()=>{
            let c = validator(id).isoDate("property");
            
            c.check({property: "2018-11-04"});
        });

        it('only allows isoDates to be validated as such', ()=>{
            let c = validator(id).isoDate("property");
            
            try
            {
                c.check({property: 1});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (1) to be a string containing an ISO-8601 date");
            }
        });

        it('does not consider null a valid isoDate', ()=>{
            let c = validator(id).isoDate("property");
            
            try
            {
                c.check({property: null});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (<null>) to be a string containing an ISO-8601 date");
            }
        });

        it('considers null a valid nullable isoDate', ()=>{
            let c = validator(id).isoDate("property").nullable();
            
            c.check({property: null});
        });

        it('considers undefined a valid optional isoDate', ()=>{
            let c = validator(id).isoDate("property").optional();

            c.check({property: undefined});
        });
    });
});
