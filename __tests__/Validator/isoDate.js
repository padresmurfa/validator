import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('isoDate',()=>{

        const id = "test-validator-isoDate";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when isoDate is called without a property', ()=>{
            let property = container.property();
            expect(property).toBeNull();

            try
            {
                container.isoDate();
            }
            catch (e)
            {
                expect(e.message).toBe("Only properties may be expected to be ISO dates");
            }
        });

        it('returns "this" like a good fluent api when a isoDate requirement is added', ()=>{
            let property = container.isoDate("smurf");
            expect(property).toBe(container);
        });

        it('remembers that a isoDate is expected', ()=>{
            let property = container.isoDate("smurf").property();
            expect(property.expectIsoDate).toBe(true);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.isoDate();
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);

        });
    });
});
