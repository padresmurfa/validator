import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('optional',()=>{

        const id = "test-validator-optional";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when optional is called without a property', ()=>{
            let property = container.property();
            expect(property).toEqual({});

            try
            {
                container.optional();
            }
            catch (e)
            {
                assume.fail("Properties should not be required");
            }
        });

        it('returns "this" like a good fluent api when an optional declaration is added', ()=>{
            let property = container.optional("smurf");
            expect(property).toBe(container);
        });

        it('remembers that an optional is expected', ()=>{
            let property = container.optional("smurf").property();
            expect(property.expectDefined).toBe(false);
            expect(property.expectUndefined).toBe(false);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.optional();
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);

        });
    });
});
