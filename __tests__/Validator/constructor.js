import _ from 'lodash';

import validator, { Validator, ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('constructor',()=>{

        it('validators have a path upon creation', ()=>{
            const id = "test-validator-container";

            const created = new Validator(id);

            expect(created.path()).toBe(id);

        });
    });
});
