import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('immutable',()=>{

        const id = "test-validator-immutable";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when immutable is called without a property', ()=>{
            let property = container.property();
            expect(property).toBeNull();

            try
            {
                container.immutable();
            }
            catch (e)
            {
                expect(e.message).toBe("Only properties may be expected to be immutable");
            }
        });

        it('returns "this" like a good fluent api when an immutable requirement is added', ()=>{
            let property = container.property("smurf").immutable();
            expect(property).toBe(container);
        });

        it('remembers that an immutable is expected', ()=>{
            let property = container.property("smurf").immutable().property();
            expect(property.expectImmutable).toBe(true);
        });

        it('expect integers to be immutable', ()=>{
            let property = container.property("smurf").integer().property();
            expect(property.expectImmutable).toBe(true);
        });

        it('expect strings to be immutable', ()=>{
            let property = container.property("smurf").string().property();
            expect(property.expectImmutable).toBe(true);
        });

        it('expect booleans to be immutable', ()=>{
            let property = container.property("smurf").boolean().property();
            expect(property.expectImmutable).toBe(true);
        });

        it('expect dates to be non-immutable', ()=>{
            let property = container.property("smurf").date().property();
            expect(property.expectImmutable).toBeUndefined();
        });

        it('expect objects to be non-immutable', ()=>{
            let property = container.property("smurf").object((item)=>{ return item; }).property();
            expect(property.expectImmutable).toBeUndefined();
        });

        it('expect arrays to be non-immutable', ()=>{
            let property = container.property("smurf").array((item)=>{ return item; }).property();
            expect(property.expectImmutable).toBeUndefined();
        });

        it('expect ISO dates to be immutable', ()=>{
            let property = container.property("smurf").isoDate().property();
            expect(property.expectImmutable).toBe(true);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.immutable();
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
