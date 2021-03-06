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
            expect(property).toEqual({});

            try
            {
                container.array();
            }
            catch (e)
            {
                assume.fail("Properties should not be required");
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

            expect(property.itemValidator.property().expectInteger).toBe(true);
        });

        it('can validate array items with an inner validator', ()=>{
            const inner = validator().boolean("rf");
            let property = container.array("smu",inner).property();

            expect(property.expectArray).toBe(true);
            expect(property.itemValidator.property("rf").property().expectBoolean).toBe(true);
            expect(property.itemValidator.property("rf").path()).toBe(id + "/smu/rf");
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
