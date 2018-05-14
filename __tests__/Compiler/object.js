import validator, { ValidationFailed } from 'src/index';
import assume from '@padresmurfa/assume';

class Schema
{
    get(id)
    {
        id = id || "";
        this[id] =  this[id] || validator(id);
        return  this[id];
    }
}

function createSchema()
{
    const retval = new Schema();

    retval.get("Int32").integer("value").intercept((value)=>{
        return (value % 1 === 0) &&
                (value >= -2147483648) && (value <= 2147483647)
    });

    return retval;
}

describe('Compiler', ()=>{

    const id = "test-validator-Compiler";

    describe('object',()=>{

        it('can compile and check an object validator', ()=>{
            let c = validator(id).object();
            
            c.check({});
        });

        it('accepts null for nullable object validators', ()=>{
            let c = validator(id).object().nullable();
            
            c.check(null);
        });

        it('accepts an object item', ()=>{
            let c = validator(id).object((item)=>{
                return item.string("Actor").isoDate("Now");
            });
            
            c.check({Actor:"dsa",Now:"33"});
        });

        it('accepts an object item', ()=>{
            let c = createSchema().get("Request").object((item)=>{
                return item.string("Actor").isoDate("Now");
            });
            
            c.check({Actor:"dsa",Now:"33"});
        });
    });
});
