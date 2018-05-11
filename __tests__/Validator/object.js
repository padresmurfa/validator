import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('object',()=>{

        const id = "test-validator-object";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when object is called without a property', ()=>{
            let property = container.property();
            expect(property).toBeNull();

            try
            {
                container.object();
            }
            catch (e)
            {
                expect(e.message).toBe("Only properties may be expected to be an object");
            }
        });

        it('returns "this" like a good fluent api when an object declaration is added', ()=>{
            let property = container.object("smurf");
            expect(property).toBe(container);
        });

        it('remembers that an object is expected', ()=>{
            let property = container.object("smurf").property();
            expect(property.expectObject).toBe(true);
        });

        it('remembers object item validators', ()=>{
            let property = container.object("smurf", (item)=>{
                return item.integer("pro");
            }).property();

            expect(property.expectObject).toBe(true);

            expect(property.objectValidator).toBeDefined();
            expect(property.objectValidator).not.toBeNull();
            
            let self = property.objectValidator.property(":self");
            expect(self).toBeDefined();
            expect(self).not.toBeNull();
        });

        it('can validate object items', ()=>{
            let property = container.object("smurf", (item)=>{
                return item.integer();
            }).property();

            expect(property.objectValidator.property(":self").property().expectInteger).toBe(true);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.object((item)=>{
                return item.integer();
            });
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
