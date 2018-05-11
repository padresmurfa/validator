import { ValidationFailed } from 'src/index';
import assume, { AssumptionFailed } from '@padresmurfa/assume';

describe('validationFailed', ()=>{

    it('constructs new instances with a message', ()=>{
        const vf = new ValidationFailed("a message");
        expect(vf.message).toBe("a message");
    });

    it('derives from AssumptionFailed', ()=>{
        const vf = new ValidationFailed("a message");
        const isAssumptionFailed = vf instanceof AssumptionFailed;
        expect(isAssumptionFailed).toBe(true);
    });

    it('is an Error', ()=>{
        const vf = new ValidationFailed("a message");
        assume.isError(vf);
    });
});
