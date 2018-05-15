import _ from 'lodash';

import validator, { ValidationFailed } from 'src/index';

describe('validator', ()=>{

    describe('unique',()=>{

        const id = "test-validator-unique";

        let container;

        beforeEach(()=>{
            container = validator(id);
        });

        it('supports uniqueness on arrays', ()=>{
            const p = container.array("asdf").unique().property();
            expect(p.expectUniqueCollection).toBe(true);
        });

        it('does not support uniqueness on objects', ()=>{
            try
            {
                container.object("asdf").unique();
                assume.fail();
            }
            catch(e)
            {
                expect(e.message).toBe("Only arrays can be declared to have unique children");
            }
        });

        it('does not support uniqueness on immutables', ()=>{
            try
            {
                container.immutable("asdf").unique();
                assume.fail();
            }
            catch(e)
            {
                expect(e.message).toBe("Only arrays can be declared to have unique children");
            }
        });

        it('determines uniqueness based on immutable value of item by default', ()=>{
            const p = container.array("asdf").unique().property();
            expect(p.uniqueCriteria("a")).toBe("a");
        });

        it('handles uniqueness of Date based on getTime() value of item by default', ()=>{
            const p = container.array("asdf").unique().property();
            var t = new Date();
            expect(p.uniqueCriteria(t)).toBe(t.getTime());
        });

        it('rejects non-immutable items when using default uniqueness criteria', ()=>{
            const p = container.array("asdf").unique().property();
            try
            {
                p.uniqueCriteria({});
                assume.fail();
            }
            catch(e)
            {
                expect(e.message).toBe(id + "/asdf: Only immutable items can be placed in unique properties using default uniqueness");
            }
        });

        it('allows functions as uniqueness criteria', ()=>{
            const p = container.array("asdf").unique((x)=>{ return x; }).property();
            expect(p.uniqueCriteria("a")).toBe("a");
        });

        it('allows property names as uniqueness criteria', ()=>{
            const p = container.array("asdf").unique("x").property();
            expect(p.uniqueCriteria({x: "a"})).toBe("a");
        });

        it('handles property names referring to Dates by unique getTime()', ()=>{
            const p = container.array("asdf").unique("x").property();
            var t = new Date();
            expect(p.uniqueCriteria({x: t})).toBe(t.getTime());
        });

        it('retains custom messages regarding uniqueness violations, if present', ()=>{
            const p = container.array("asdf").unique("x","X should be a turkey").property();
            expect(p.uniqueCriteriaMsg).toBe("X should be a turkey");
        });

        it('flags the property for recompilation after update', ()=>{
            let before = container.array("smurf").compiled();
            container.unique("x","X should be a turkey");
            let after = container.array("smurf").compiled();
            expect(before).not.toBe(after);            
        });
    });
});
