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

    /*
    describe('object',()=>{
        it('accepts an object item', ()=>{
            let c = validator(id).object((item)=>{
                return item.string("Actor").isoDate("Now");
            });
            
            c.check({Actor:"dsa",Now:"2018-04-07"});
        });
    });
    return;
    */

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
            
            c.check({Actor:"dsa",Now:"2018-04-07"});
        });

        it('validates using an inner validator', ()=>{
            const inner = validator().boolean("rf");
            const c = validator("arr").object("smu",inner);

            c.check({smu: {rf: true}});
            try
            {
                c.check({smu: {rf: null}});
                assume.fail();
            }
            catch (e)
            {
                expect(e.message).toBe("arr/smu/rf: Expected value (<null>) to be a boolean");
            }
        });
        
        it('validates a complex structure', ()=>{
            let c = createSchema().get("GetOrdersRsp").object((item)=>{
                return item.
                    boolean("Ok").
                    object("Payload", (item)=>{
                        return item.array("ShoppingCarts",(item)=>{
                            return item.integer("Id").
                                isoDate("TimeStamp").
                                array("Contents", (item)=>{
                                    return item.
                                        integer("Id").
                                        integer("ProductId").
                                        integer("Quantity").
                                        boolean("Undoable").
                                        isoDate("DeliveryDate");
                                });
                        });
                    });
                });
            
            c.check({
                Ok:true,
                Payload:{
                    ShoppingCarts:[
                        {
                            Id: 1,
                            TimeStamp: "2013-06-12",
                            Contents:[
                                {Id:1, ProductId: 2, Quantity: 3, Undoable: true, DeliveryDate: "2011-09-07"}
                            ]
                        }
                    ]
                }
            });
        });
        
    });
});
