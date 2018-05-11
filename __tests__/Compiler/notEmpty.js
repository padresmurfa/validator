import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('notEmpty',()=>{
        
        it('can compile and check an notEmpty string validator', ()=>{
            let c = validator(id).string("property").notEmpty();

            c.check({property: "a"});
        });
        
        it('can compile and check an notEmpty array validator', ()=>{
            let c = validator(id).array("property").notEmpty();
            
            c.check({property: [1]});
        });

        it('can compile and check an notEmpty object validator', ()=>{
            let c = validator(id).object("property").notEmpty();
            
            c.check({property: {a:1}});
        });

        it('can compile and check a failing notEmpty string validator', ()=>{
            let c = validator(id).string("property").notEmpty();
            
            try
            {
                c.check({property: ""});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (\"\") to not be empty");
            }
        });

        it('can compile and check a failing notEmpty array validator', ()=>{
            let c = validator(id).array("property").notEmpty();
            
            try
            {
                c.check({property: []});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (<array>) to not be empty");
            }
        });

        it('can compile and check a failing notEmpty object validator', ()=>{
            let c = validator(id).object("property").notEmpty();

            try
            {
                c.check({property: {}});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (<object>) to not be empty");
            }
        });
    });
});
