import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('clone',()=>{

        const id = "test-validator-clone";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('requires clones to have a variant name', ()=>{
            try
            {
                container.clone();
            }
            catch (e)
            {
                expect(e.message).toBe("Clones must have a variant name");
            }
        });

        it('requires variant names to be strings', ()=>{
            try
            {
                container.clone(1);
            }
            catch (e)
            {
                expect(e.message).toBe("Clones must have a variant name");
            }
        });
        
        it('requires variant names to be non-empty', ()=>{
            try
            {
                container.clone("");
            }
            catch (e)
            {
                expect(e.message).toBe("Clones must have a variant name");
            }
        });
        
        it('requires variant names to be non-whitespace-only', ()=>{
            try
            {
                container.clone(" ");
            }
            catch (e)
            {
                expect(e.message).toBe("Clones must have a variant name");
            }
        });
    });
});
