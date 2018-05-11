import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('empty',()=>{
        
        it('can compile and check an empty string validator', ()=>{
            let c = validator(id).string("property").empty();

            c.check({property: ""});
        });
        
        it('can compile and check an empty array validator', ()=>{
            let c = validator(id).array("property").empty();

            c.check({property: []});
        });

        it('can compile and check an empty object validator', ()=>{
            let c = validator(id).object("property").empty();
            
            c.check({property: {}});
        });

        it('can compile and check a failing empty string validator', ()=>{
            let c = validator(id).string("property").empty();

            try
            {
                c.check({property: "1"});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (\"1\") to be empty");
            }
        });

        it('can compile and check a failing empty array validator', ()=>{
            let c = validator(id).array("property").empty();
            
            try
            {
                c.check({property: [7]});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (<array>) to be empty");
            }
        });

        it('can compile and check a failing empty object validator', ()=>{
            let c = validator(id).object("property").empty();

            try
            {
                c.check({property: {a:3}});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (<object>) to be empty");
            }
        });
    });
});
