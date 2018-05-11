import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('required',()=>{

        const id = "test-validator-required";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when required is called without a property', ()=>{
            let property = container.property();
            expect(property).toBeNull();

            try
            {
                container.required();
            }
            catch (e)
            {
                expect(e.message).toBe("Only properties may be expected to be defined");
            }
        });

        it('returns "this" like a good fluent api when a required requirement is added', ()=>{
            let property = container.required("smurf");
            expect(property).toBe(container);
        });

        it('remembers that a required is expected', ()=>{
            let property = container.required("smurf").property();
            expect(property.expectDefined).toBe(true);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.required();
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
