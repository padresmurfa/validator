import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";
    
    describe('immutable',()=>{

        it('can compile and check an immutable validator', ()=>{
            let c = validator(id).immutable("property");
            
            c.check({property: true});
        });

        it('can validate that a boolean is immutable', ()=>{
            let c = validator(id).immutable("property");

            c.check({property: true});
        });

        it('can validate that an integer is immutable', ()=>{
            let c = validator(id).immutable("property");

            c.check({property: 1});
        });

        it('can validate that a string is immutable', ()=>{
            let c = validator(id).immutable("property");
            
            c.check({property: "a"});
        });


        it('can validate that null is not immutable', ()=>{
            let c = validator(id).immutable("property");
            
            try
            {
                c.check({property: null});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (<null>) to be immutable");
            }
        });

        it('can validate that a Date is not immutable', ()=>{
            let c = validator(id).immutable("property");

            try
            {
                c.check({property: new Date()});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (<date>) to be immutable");
            }
        });
        
        it('can validate that an object is not immutable', ()=>{
            let c = validator(id).immutable("property");
            
            try
            {
                c.check({property: {a:1}});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (<object>) to be immutable");
            }
        });

        it('can validate that an array is not immutable', ()=>{
            let c = validator(id).immutable("property");

            try
            {
                c.check({property: []});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (<array>) to be immutable");
            }
        });
    });
});
