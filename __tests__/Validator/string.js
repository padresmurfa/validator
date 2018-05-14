import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('string',()=>{

        const id = "test-validator-string";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when string is called without a property', ()=>{
            let property = container.property();
            expect(property).toEqual({});

            try
            {
                container.string();
            }
            catch (e)
            {
                assume.fail("Properties should not be required");
            }
        });

        it('returns "this" like a good fluent api when a string requirement is added', ()=>{
            let property = container.string("smurf");
            expect(property).toBe(container);
        });

        it('remembers that a string is expected', ()=>{
            let property = container.string("smurf").property();
            expect(property.expectString).toBe(true);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.string();
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
