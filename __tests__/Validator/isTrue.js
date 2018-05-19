import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('isTrue',()=>{

        const id = "test-validator-isTrue";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('returns "this" like a good fluent api when an isTrue declaration is added', ()=>{
            let property = container.isTrue();
            expect(property).toBe(container);
        });

        it('remembers that an isTrue is expected', ()=>{
            let property = container.isTrue("smurf").property();
            expect(property.expectTrue).toBe(true);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.isTrue();
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
