import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('date',()=>{

        const id = "test-validator-date";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when date is called without a property', ()=>{
            let property = container.property();
            expect(property).toEqual({});

            try
            {
                container.date();
            }
            catch (e)
            {
                assume.fail("Properties should not be required");
            }
        });

        it('returns "this" like a good fluent api when a date requirement is added', ()=>{
            let property = container.date("smurf");
            expect(property).toBe(container);
        });

        it('remembers that a date is expected', ()=>{
            let property = container.date("smurf").property();
            expect(property.expectDate).toBe(true);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.date();
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);

        });
    });
});
