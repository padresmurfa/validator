import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('isFalse',()=>{

        const id = "test-validator-isFalse";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('returns "this" like a good fluent api when an isFalse declaration is added', ()=>{
            let property = container.isFalse();
            expect(property).toBe(container);
        });

        it('remembers that an isFalse is expected', ()=>{
            let property = container.isFalse("smurf").property();
            expect(property.expectFalse).toBe(true);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.isFalse();
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
