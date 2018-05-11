import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('nullable',()=>{

        it('can compile and check a nullable validator', ()=>{
            let c = validator(id).integer("property").nullable();
            
            c.check({property: 1});
        });

        it('accepts null for nullable validators', ()=>{
            let c = validator(id).integer("property").nullable();
            
            c.check({property: null});
        });
    });
});
