import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('boolean',()=>{

        const id = "test-validator-boolean";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when boolean is called without a property', ()=>{
            let property = container.property();
            expect(property).toBeNull();

            try
            {
                container.boolean();
            }
            catch (e)
            {
                expect(e.message).toBe("Only properties may be expected to be booleans");
            }
        });

        it('returns "this" like a good fluent api when a boolean requirement is added', ()=>{
            let property = container.boolean("smurf");
            expect(property).toBe(container);
        });

        it('remembers that a boolean is expected', ()=>{
            let property = container.boolean("smurf").property();
            expect(property.expectBoolean).toBe(true);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.boolean();
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
