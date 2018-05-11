import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('property',()=>{

        const id = "test-validator-property";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('returns null when property is not found', ()=>{
            let property = container.property();
            expect(property).toBeNull();
        });

        it('returns "this" like a good fluent api when a property is added', ()=>{
            let property = container.property("property");
            expect(property).toBe(container);
        });

        it('returns a container when a property is found', ()=>{
            let property = container.property("property");
            expect(property).toBe(container);

            property = container.property();
            expect(_.isObject(property)).toBe(true);
        });

        it('properties are required by default', ()=>{
            let property = container.property("property");
            expect(property).toBe(container);

            property = container.property();
            expect(property.expectDefined).toBe(true);
        });

        it('properties are uncompiled by default', ()=>{
            let property = container.property("property");
            expect(property.__compiled).toBe(null);
        });
    });
});
