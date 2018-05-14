import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('empty',()=>{

        const id = "test-validator-empty";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when empty is called without a property', ()=>{
            let property = container.property();
            expect(property).toEqual({});

            try
            {
                container.empty();
            }
            catch (e)
            {
                assume.fail("Properties should not be required");
            }
        });

        it('returns "this" like a good fluent api when an empty declaration is added', ()=>{
            let property = container.empty("smurf");
            expect(property).toBe(container);
        });

        it('remembers that an empty is expected', ()=>{
            let property = container.empty("smurf").property();
            expect(property.expectEmpty).toBe(true);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.empty();
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
