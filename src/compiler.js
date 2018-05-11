import moment from 'moment';
import _ from 'lodash';

import assume, { Assume, normalizeClassNames } from '@padresmurfa/assume';

import ValidationFailed from './validation-failed';

function rename(newName, func)
{
    Object.defineProperty(func, "name", { value: newName });

    return func;
}

class Compiled
{
    constructor(property)
    {
        this.checks = [];
        this.property = property;
    }

    check(value)
    {
        /*

        console.log("check: ", {
            isObject: this.isObject,
            isNullable: this.isNullable,
            isOptional: this.isOptional,
            checks: this.checks,
            value,
            property: this.property
        });

        */

       // this.isObject = p.expectObject === true;

       _.forEach(this.checks, (check)=>{ this.checkProperty(check, value[check.propName]); });

       return;

       const l = this.checks.length;

       for (var i = 0; i < l; i++)
       {
            const check = this.checks[i];

            const label = `Compiled.check[${check.propName}]`;

            const method = rename(label, this.__checkProperty);

            method();
        }
    }

    checkProperty(check, propertyValue)
    {
        const isNullable = this.property[check.propName].expectNullable === true;
        const isOptional = this.property[check.propName].expectDefined === false;

        if ((propertyValue === null) && isNullable)
        {
            return;
        }
        if ((propertyValue === undefined) && isOptional)
        {
            return;
        }
        check.method(propertyValue);
    }

    add(propName, condition, method)
    {
        this.checks.push({
            propName,
            condition,
            method
        });
    }
}

class Compiler {

    static compile(property, identifier, assumptionEngineFactory)
    {
        assume.isObject(property, "Can only check known properties of objects");

        const c = new Compiled(property);

        // TODO: prevent inconsistent declarations during construction

        _.forEach(property,(p,propName)=>{

            const ae = assumptionEngineFactory(identifier + "/" + propName);

            if (p.expectUndefined === true)
            {
                c.add( propName, "isUndefined", ae.isUndefined );
            }
            if (p.expectDefined === true)
            {
                c.add( propName, "isDefined", ae.isDefined );
            }
            if (p.expectNotEmpty === true)
            {
                c.add( propName, "isNotEmpty", ae.isNotEmpty );
            }
            if (p.expectEmpty === true)
            {
                c.add( propName, "isEmpty", ae.isEmpty );
            }
            if (p.expectString === true)
            {
                c.add( propName, "isString", ae.isString );
            }
            if (p.expectArray === true)
            {
                c.add( propName, "isArray", ae.isArray );
            }
            if (p.expectDate === true)
            {
                c.add( propName, "isDate", ae.isDate );
            }
            if (p.expectInteger === true)
            {
                c.add( propName, "isInteger", ae.isInteger );
            }
            if (p.expectBoolean === true)
            {
                c.add( propName, "isBoolean", ae.isBoolean );
            }
            if (p.expectObject === true)
            {
                c.add( propName, "isObject", ae.isObject );
            }
            if (p.expectIsoDate === true)
            {
                c.add( propName, "isIsoDate", ae.isIsoDate );
            }
            if (p.expectImmutable === true)
            {
                c.add( propName, "isImmutable", ae.isImmutable );
            }
            if (p.itemValidator !== undefined)
            {
                c.add( propName, "isArrayItem", (v)=>{
                    _.forEach(v,(item)=>{
                        p.itemValidator.check(item);
                    });
                });
            }
            if (p.objectValidator !== undefined)
            {
                c.add( propName, "isObject", p.objectValidator.check );
            }
            if (p.uniqueCriteria !== undefined)
            {
                c.add( propName, "isUnique", (v)=>{
                    const vl = v.length;
                    const ol = _.uniqBy(v, p.uniqueCriteria).length;
                    const msg = undefined; // p.uniqueCriteriaMsg; || "Expected a collection of unique items";
                    ae.areEqual(vl, ol, msg);
                });
            }
            if (p.expectInstanceOf !== undefined)
            {
                c.add("isInstanceOf", (v)=>{
                    ae.isInstanceOf(v, p.expectInstanceOf);
                });
            }
        });

        return c;
    }
}

export default Compiler.compile;
