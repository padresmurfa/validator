import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('array',()=>{

        it('can compile and check a array validator', ()=>{
            let c = validator(id).array("property");

            c.check({property: []});
        });

        it('can compile and check an array validator using property-first syntax', ()=>{
            let c = validator(id).property("property").array();

            c.check({property: []});
        });

        it('can compile and check an array with an item validator', ()=>{
            let c = validator(id).array("blarrr",(item)=>{
                return item.string();
            });

            c.check({blarrr: ["asdf"]});
        });
        
        it('only allows arrays to be validated as such', ()=>{
            let c = validator(id).array("property");

            try
            {
                c.check({property: "false"});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (\"false\") to be an array");
            }
        });
        
        it('does not consider null a valid array', ()=>{
            let c = validator(id).array("property");

            try
            {
                c.check({property: null});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe(id + "/property: Expected value (<null>) to be an array");
            }
        });

        it('considers null a valid nullable array', ()=>{
            let c = validator(id).array("property").nullable();

            c.check({property: null});
        });

        it('considers undefined a valid optional array', ()=>{
            let c = validator(id).array("property").optional();

            c.check({property: undefined});
        });
    });
});
