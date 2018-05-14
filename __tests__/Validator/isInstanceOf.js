import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('isInstanceOf',()=>{

        const id = "test-validator-isInstanceOf";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('throws error when instanceOf is called without a property', ()=>{
            let property = container.property();
            expect(property).toEqual({});

            try
            {
                container.instanceOf("asdf");
            }
            catch (e)
            {
                assume.fail("Properties should not be required");
            }
        });

        it('returns "this" like a good fluent api when a instanceOf requirement is added', ()=>{
            let property = container.property("smurf").instanceOf("asdf");
            expect(property).toBe(container);
        });

        it('remembers that an instanceOf is expected', ()=>{
            let property = container.property("smurf").instanceOf("asdf").property();
            expect(property.expectInstanceOf).toEqual(["asdf"]);
        });

        it('supports strings as class names', ()=>{
            let property = container.property("smurf").instanceOf("asdf").property();
            expect(property.expectInstanceOf).toEqual(["asdf"]);
        });

        it('supports strings delimited by commas as class names', ()=>{
            let property = container.property("smurf").instanceOf("asdf,basdf").property();
            expect(property.expectInstanceOf).toEqual(["asdf","basdf"]);
        });

        it('supports strings delimited by semicolons as class names', ()=>{
            let property = container.property("smurf").instanceOf("asdf;basdf").property();
            expect(property.expectInstanceOf).toEqual(["asdf","basdf"]);
        });

        it('supports strings delimited by colons as class names', ()=>{
            let property = container.property("smurf").instanceOf("asdf:basdf").property();
            expect(property.expectInstanceOf).toEqual(["asdf","basdf"]);
        });

        it('supports strings delimited by periods as class names', ()=>{
            let property = container.property("smurf").instanceOf("asdf.basdf").property();
            expect(property.expectInstanceOf).toEqual(["asdf","basdf"]);
        });

        it('supports strings delimited by whitespace as class names', ()=>{
            let property = container.property("smurf").instanceOf("asdf basdf").property();
            expect(property.expectInstanceOf).toEqual(["asdf","basdf"]);
        });

        it('does not support e.g. lists of strings as class names', ()=>{
            try
            {                
                container.property("smurf").instanceOf(["asd","basdf"]);
            }
            catch (e)
            {
                expect(e.message).toBe("Class names should be specified as a delimited string");
            }
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.instanceOf("asdf basdf");
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
