import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('required',()=>{

        it('can compile and check a required validator', ()=>{
            let c = validator(id).string("property").required();
            
            c.check({property: "asd"});
        });
    });
});
