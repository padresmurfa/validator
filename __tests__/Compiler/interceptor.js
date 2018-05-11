import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('interceptor',()=>{

        it('can compile and check a interceptor validator', ()=>{
            var called = false;
            let c = validator(id).property("property").intercept((x)=>{
                called = true;
                return true;
            });

            c.check({property: true});

            expect(called).toBe(true);
        });

        it('can compile and check a failed interceptor validator', ()=>{
            var called = false;
            let c = validator(id).property("property").intercept((x)=>{
                called = true;
                return "Errrrr";
            });

            try
            {
                c.check({property: true});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Errrrr");
            }

            expect(called).toBe(true);
        });
    });
});
