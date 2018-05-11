import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('path',()=>{

        const id = "test-validator-path";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('returns id when no property present', ()=>{
            let path = container.path();
            expect(path).toBe(id);
        });

        it('returns id and property name when property present', ()=>{
            container.property("soft");
            let path = container.path();
            expect(path).toBe(id + "/soft");
        });
    });
});
