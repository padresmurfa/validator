import { AssumptionFailed } from '@padresmurfa/assume';

export default class ValidationFailed extends AssumptionFailed
{
    constructor(msg)
    {
        super(msg);
    }
}
