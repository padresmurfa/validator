import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('mapping',()=>{

        it('can compile and check a mapping validator', ()=>{
            let c = validator(id).mapping();
            
            c.check({});
        });

        it('accepts null for nullable mapping validators', ()=>{
            let c = validator(id).mapping().nullable();
            
            c.check(null);
        });

        it('accepts a mapping item', ()=>{
            let c = validator(id).mapping((item)=>{
                return item.isoDate();
            });
            
            c.check({1:"2018-04-07"});
        });

        it('validates using an inner validator', ()=>{
            const inner = validator().boolean();
            const c = validator("arr").mapping("smu",inner);

            c.check({smu: {6: true}});
            try
            {
                c.check({smu: {6: null}});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe("arr/smu/$: Expected value (<null>) to be a boolean");
            }
        });
        
    });
});
