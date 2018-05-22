import _ from 'lodash';
import assume from '@padresmurfa/assume';

class Compiled
{
    constructor(property)
    {
        this.checks = [];
        this.property = property;
    }

    check(value)
    {
        _.forEach(this.checks, (check)=>{

            let v = value;

            if (check.propName !== "$")
            {
                v = v[check.propName];
            }
            this.checkProperty(check, v);
        });
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
            condition,
            method,
            propName
        });
    }
}

class Compiler {

    /* eslint-disable complexity, max-statements */

    // TODO: prevent inconsistent declarations during construction
    //       and set up the asserts beforehand

    static compile(property, identifier, assumptionEngineFactory)
    {
        assume.isObject(property, "Can only check known properties of objects");

        const c = new Compiled(property);

        _.forEach(property,(p,propName)=>{

            const ae = assumptionEngineFactory(identifier + "/" + propName);

            if (p.interceptValidation !== undefined)
            {
                c.add(propName, "intercept", (...args)=>{

                    const ret = p.interceptValidation(...args);

                    ae.isTrue(ret, ret);
                });
            }
            if (p.expectUndefined === true)
            {
                c.add(propName, "isUndefined", ae.isUndefined);
            }
            if (p.expectDefined === true)
            {
                c.add(propName, "isDefined", ae.isDefined);
            }
            if (p.expectNotEmpty === true)
            {
                c.add(propName, "isNotEmpty", ae.isNotEmpty);
            }
            if (p.expectEmpty === true)
            {
                c.add(propName, "isEmpty", ae.isEmpty);
            }
            if (p.expectTrue === true)
            {
                c.add(propName, "isTrue", ae.isTrue);
            }
            if (p.expectFalse === true)
            {
                c.add(propName, "isFalse", ae.isFalse);
            }
            if (p.expectString === true)
            {
                c.add(propName, "isString", ae.isString);
            }
            if (p.expectArray === true)
            {
                c.add(propName, "isArray", ae.isArray);
            }
            if (p.expectDate === true)
            {
                c.add(propName, "isDate", ae.isDate);
            }
            if (p.expectInteger === true)
            {
                c.add(propName, "isInteger", ae.isInteger);
            }
            if (p.expectBoolean === true)
            {
                c.add(propName, "isBoolean", ae.isBoolean);
            }
            if (p.expectObject === true)
            {
                c.add(propName, "isObject", ae.isObject);
            }
            if (p.expectMapping === true)
            {
                // mappings are objects where the key is not fixed
                // TODO: proper error message on failure
                c.add(propName, "isMapping", ae.isObject);
            }
            if (p.expectIsoDate === true)
            {
                c.add(propName, "isIsoDate", ae.isIsoDate);
            }
            if (p.expectImmutable === true)
            {
                c.add(propName, "isImmutable", ae.isImmutable);
            }
            if (p.itemValidator !== undefined)
            {
                c.add(propName, "isArrayItem", (v)=>{
                    _.forEach(v,(item)=>{
                        p.itemValidator.check(item);
                    });
                });
            }
            if (p.mappingValueValidator !== undefined)
            {
                c.add(propName, "isMappingValue", (v)=>{
                    _.forEach(v,(item)=>{
                        p.mappingValueValidator.check(item);
                    });
                });
            }
            if (p.objectValidator !== undefined)
            {
                c.add(propName, "isObject", p.objectValidator.check.bind(p.objectValidator));
            }
            if (p.uniqueCriteria !== undefined)
            {
                c.add(propName, "isUnique", (v)=>{
                    const vl = v.length;
                    const ol = _.uniqBy(v, p.uniqueCriteria).length;
                    const msg = p.uniqueCriteriaMsg || "Expected a collection of unique items";
                    
                    ae.areEqual(vl, ol, msg);
                });
            }
            if (p.expectIs !== undefined)
            {
                _.forEach(p.expectIs,(is)=>{
                    c.add(propName, "is", is.check.bind(is));
                });
            }
        });

        return c;
    }

    /* eslint-enable complexity, max-statements */
}

export default Compiler.compile;
