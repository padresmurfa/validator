import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('absent',()=>{

        const id = "test-validator-absent";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when absent is called without a property', ()=>{
            let property = container.property();
            expect(property).toEqual({});

            try
            {
                container.absent();
            }
            catch (e)
            {
                assume.fail("Properties should not be required");
            }
        });

        it('returns "this" like a good fluent api when a absent requirement is added', ()=>{
            let property = container.absent("smurf");
            expect(property).toBe(container);
        });

        it('remembers that a absent is expected', ()=>{
            let property = container.absent("smurf").property();
            expect(property.expectUndefined).toBe(true);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.absent();
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
