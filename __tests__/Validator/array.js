import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('array',()=>{

        const id = "test-validator-array";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when array is called without a property', ()=>{
            let property = container.property();
            expect(property).toBeNull();

            try
            {
                container.array();
            }
            catch (e)
            {
                expect(e.message).toBe("Only properties may be expected to be an array");
            }
        });

        it('returns "this" like a good fluent api when an array declaration is added', ()=>{
            let property = container.array("smurf");
            expect(property).toBe(container);
        });

        it('remembers that an array is expected', ()=>{
            let property = container.array("smurf").property();
            expect(property.expectArray).toBe(true);
        });

        it('remembers array item validators', ()=>{
            let property = container.array("smurf", (item)=>{
                return item.integer();
            }).property();

            expect(property.expectArray).toBe(true);

            expect(property.itemValidator).toBeDefined();
            expect(property.itemValidator).not.toBeNull();
        });

        it('can validate array items', ()=>{
            let property = container.array("smurf", (item)=>{
                return item.integer();
            }).property();

            expect(property.itemValidator.property(":array-item").property().expectInteger).toBe(true);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.array((item)=>{
                return item.integer();
            });
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);        
        });
    });
});
