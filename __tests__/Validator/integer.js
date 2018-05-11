import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('integer',()=>{

        const id = "test-validator-integer";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when integer is called without a property', ()=>{
            let property = container.property();
            expect(property).toBeNull();

            try
            {
                container.integer();
            }
            catch (e)
            {
                expect(e.message).toBe("Only properties may be expected to be integers");
            }
        });

        it('returns "this" like a good fluent api when a integer requirement is added', ()=>{
            let property = container.integer("smurf");
            expect(property).toBe(container);
        });

        it('remembers that a integer is expected', ()=>{
            let property = container.integer("smurf").property();
            expect(property.expectInteger).toBe(true);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.integer();
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
