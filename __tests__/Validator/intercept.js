import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('intercept',()=>{

        const id = "test-validator-intercept";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when intercept is called without a property', ()=>{
            let property = container.property();
            expect(property).toBeNull();

            try
            {
                container.intercept((x)=>{ return true; });
            }
            catch (e)
            {
                expect(e.message).toBe("Only properties may be intercepted");
            }
        });

        it('throws error when intercept is called without a function', ()=>{
            let property = container.property();
            expect(property).toBeNull();

            try
            {
                container.intercept(true);
            }
            catch (e)
            {
                expect(e.message).toBe("Interceptors must be functions");
            }
        });
        
        it('returns "this" like a good fluent api when an interceptor is added', ()=>{
            let property = container.property("asd").intercept((x)=>{ return true; });
            expect(property).toBe(container);
        });

        it('remembers that an interceptor is expected', ()=>{
            const cb = (x)=>{ return true; };
            let property = container.property("asd").intercept(cb).property();
            expect(property.interceptValidation).toBe(cb);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();

            container.intercept((x)=>{ return true; }).property();

            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
