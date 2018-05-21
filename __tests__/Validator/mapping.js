import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('mapping',()=>{

        const id = "test-validator-mapping";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when mapping is called without a property', ()=>{
            let property = container.property();
            expect(property).toEqual({});

            try
            {
                container.mapping();
            }
            catch (e)
            {
                assume.fail("Properties should not be required");
            }
        });

        it('returns "this" like a good fluent api when a mapping declaration is added', ()=>{
            let property = container.mapping("smurf");
            expect(property).toBe(container);
        });

        it('remembers that a mapping is expected', ()=>{
            let property = container.mapping("smurf").property();
            expect(property.expectMapping).toBe(true);
        });

        it('remembers mapping item validators', ()=>{
            let property = container.mapping("smurf", (item)=>{
                return item.integer("pro");
            }).property();

            expect(property.expectMapping).toBe(true);

            expect(property.mappingValueValidator).toBeDefined();
            expect(property.mappingValueValidator).not.toBeNull();
            
            let self = property.mappingValueValidator.property(":self");
            expect(self).toBeDefined();
            expect(self).not.toBeNull();
        });

        it('can validate mapping items', ()=>{
            let property = container.mapping("smurf", (item)=>{
                return item.integer();
            }).property();

            expect(property.mappingValueValidator.property().expectInteger).toBe(true);
        });

        it('can validate mapping items with an inner validator', ()=>{
            const inner = validator().boolean("rf");
            let property = container.mapping("smu",inner).property();

            expect(property.expectMapping).toBe(true);
            expect(property.mappingValueValidator.property("rf").property().expectBoolean).toBe(true);
            expect(property.mappingValueValidator.property("rf").path()).toBe(id + "/smu/rf");
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.mapping((item)=>{
                return item.integer();
            });
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
