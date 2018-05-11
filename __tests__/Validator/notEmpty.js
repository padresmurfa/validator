import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('notEmpty',()=>{

        const id = "test-validator-notEmpty";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when notEmpty is called without a property', ()=>{
            let property = container.property();
            expect(property).toBeNull();

            try
            {
                container.notEmpty();
            }
            catch (e)
            {
                expect(e.message).toBe("Only properties may be expected to be not empty");
            }
        });

        it('returns "this" like a good fluent api when a notEmpty declaration is added', ()=>{
            let property = container.notEmpty("smurf");
            expect(property).toBe(container);
        });

        it('remembers that an notEmpty is expected', ()=>{
            let property = container.notEmpty("smurf").property();
            expect(property.expectNotEmpty).toBe(true);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.notEmpty();
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
