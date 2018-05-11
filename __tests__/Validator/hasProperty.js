import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('hasProperty',()=>{

        const id = "test-validator-hasProperty";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('returns true when property is found', ()=>{
            let property = container.property("asdf");
            expect(property).toBe(container);

            const hasProperty = container.hasProperty("asdf");
            expect(hasProperty).toBe(true);
        });

        it('returns false when property is not found', ()=>{
            const hasProperty = container.hasProperty("asdddf");
            expect(hasProperty).toBe(false);
        });
    });
});
