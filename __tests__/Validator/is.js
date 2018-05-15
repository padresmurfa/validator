import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('is',()=>{

        const id = "test-validator-is";

        let container;
        let inner;
        let inner2;

        beforeEach(()=>{
            container = validator(id);
            inner = validator(id);
            inner2 = validator(id);
        });

        it('returns "this" like a good fluent api when a instanceOf requirement is added', ()=>{
            let property = container.property("smurf").is(inner);
            expect(property).toBe(container);
        });

        it('remembers that a duck-type is expected', ()=>{
            let property = container.property("smurf").is(inner).property();
            expect(property.expectIs).toEqual([inner]);
        });

        it('remembers that multiple duck-types are expected', ()=>{
            let property = container.property("smurf").is(inner).is(inner2).property();
            expect(property.expectIs).toEqual([inner,inner2]);
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.property("smurf").compiled();
            container.is(inner);
            let after = container.property("smurf").compiled();
            expect(before).not.toBe(after);
        });
    });
});
