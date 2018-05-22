import _ from 'lodash';
import compile from './compiler';
import ValidationFailed from './validation-failed';
import {Assume} from '@padresmurfa/assume';
import binding from '@padresmurfa/binding';

function isWhiteSpace(params) {
    if (/\S/.test(params)) {
        // string is not empty and not just whitespace
        return false;
    }

    return true;
}

function validate(path)
{
    return binding.JIT(Assume, (msg)=>
    {
        const failureMsg = `${path}: ${msg}`;
    
        return new ValidationFailed(failureMsg);
    });
}

function toComparable(item)
{
    if (_.isDate(item))
    {
        return item.getTime();
    }
    
    return item;
}

export default class Validator
{
    constructor(identifier)
    {
        this.__identifier = identifier;
        this.__propertyName = null;
        this.__storage = {};
        this.__compiled = null;
    }

    static create(...args)
    {
        return new Validator(...args);
    }

    __propertyPn(propertyName)
    {
        let pn = propertyName;

        if (pn === null)
        {
            pn = "$";
        }

        if (this.__storage[pn] === undefined)
        {
            this.__storage[pn] = {};
        }

        return pn;
    }

    property(propertyName)
    {
        if (propertyName === undefined)
        {
            const pn = this.__propertyPn(this.__propertyName);

            return this.__storage[pn];
        }
        else if (this.__propertyName !== propertyName)
        {
            this.__propertyName = this.__propertyPn(propertyName);
            // properties are required by default
            this.required();
        }

        return this;
    }

    hasProperty(propertyName)
    {
        return this.__storage[propertyName] !== undefined;
    }

    path()
    {
        if (this.__propertyName === null)
        {
            return this.__identifier;
        }

        return this.__identifier + "/" + this.__propertyName;
    }

    clone(variant)
    {
        if ((!_.isString(variant)) || (isWhiteSpace(variant)))
        {
            throw new Error("Clones must have a variant name");
        }

        const retval = new Validator(variant);

        retval.propertyName = this.__propertyName;
        retval.__storage = _.cloneDeep(this.__storage);

        return retval;
    }

    immutable(propertyName)
    {
        if (propertyName !== undefined)
        {
            this.property(propertyName);
        }

        const property = this.__updateProperty("Only properties may be expected to be immutable");

        property.expectImmutable = true;

        return this;
    }

    string(propertyName)
    {
        if (propertyName !== undefined)
        {
            this.property(propertyName);
        }

        const property = this.__updateProperty("Only properties may be expected to be strings");

        property.expectString = true;
        property.expectImmutable = true;
        property.expectNullable = false;

        return this;
    }

    integer(propertyName)
    {
        if (propertyName !== undefined)
        {
            this.property(propertyName);
        }

        const property = this.__updateProperty("Only properties may be expected to be integers");

        property.expectInteger = true;
        property.expectImmutable = true;
        property.expectNullable = false;

        return this;
    }

    boolean(propertyName)
    {
        if (propertyName !== undefined)
        {
            this.property(propertyName);
        }

        const property = this.__updateProperty("Only properties may be expected to be booleans");

        property.expectBoolean = true;
        property.expectImmutable = true;
        property.expectNullable = false;

        return this;
    }
    
    isTrue(propertyName)
    {
        if (propertyName !== undefined)
        {
            this.boolean(propertyName);
        }

        const property = this.__updateProperty("Only properties may be expected to be true");

        property.expectTrue = true;

        return this;
    }

    isFalse(propertyName)
    {
        if (propertyName !== undefined)
        {
            this.boolean(propertyName);
        }

        const property = this.__updateProperty("Only properties may be expected to be true");

        property.expectFalse = true;

        return this;
    }
    
    date(propertyName)
    {
        if (propertyName !== undefined)
        {
            this.property(propertyName);
        }

        const property = this.__updateProperty("Only properties may be expected to be dates");

        property.expectDate = true;
        property.expectNullable = false;

        return this;
    }

    isoDate(propertyName)
    {
        if (propertyName !== undefined)
        {
            this.property(propertyName);
        }

        const property = this.__updateProperty("Only properties may be expected to be ISO dates");

        property.expectIsoDate = true;
        property.expectImmutable = true;
        property.expectNullable = false;

        return this;
    }

    required(propertyName)
    {
        if (propertyName !== undefined)
        {
            this.property(propertyName);
        }

        const property = this.__updateProperty("Only properties may be expected to be defined");

        property.expectDefined = true;
        property.expectUndefined = false;

        return this;
    }

    absent(propertyName)
    {
        if (propertyName !== undefined)
        {
            this.property(propertyName);
        }

        const property = this.__updateProperty("Only properties may be expected to be undefined");

        property.expectDefined = false;
        property.expectUndefined = true;

        return this;
    }

    optional(propertyName)
    {
        if (propertyName !== undefined)
        {
            this.property(propertyName);
        }

        const property = this.__updateProperty("Only properties may be expected to be optionally defined");

        property.expectDefined = false;
        property.expectUndefined = false;

        return this;
    }

    nullable(propertyName)
    {
        if (propertyName !== undefined)
        {
            this.property(propertyName);
        }

        const property = this.__updateProperty("Only properties may be expected to be nullable");

        property.expectNullable = true;

        return this;
    }
    
    empty(propertyName)
    {
        if (propertyName !== undefined)
        {
            this.property(propertyName);
        }

        const property = this.__updateProperty("Only properties may be expected to be empty");

        property.expectEmpty = true;

        return this;
    }

    notEmpty(propertyName)
    {
        if (propertyName !== undefined)
        {
            this.property(propertyName);
        }

        const property = this.__updateProperty("Only properties may be expected to be not empty");

        property.expectNotEmpty = true;

        return this;
    }

    __collection(propertyName, ciValidator, wat)
    {
        let pn = propertyName;
        let subValidator = ciValidator;

        if (pn !== undefined)
        {
            if (subValidator === undefined && !_.isString(pn))
            {
                subValidator = pn;
                pn = undefined;
            }
            else
            {
                this.property(pn);
            }
        }

        const property = this.__updateProperty(`Only properties may be expected to be ${wat}`);

        property.expectNullable = false;

        return {
            property,
            subValidator
        };
    }

    array(propertyName, arrayItemValidator)
    {
        const {property, subValidator} = this.__collection(propertyName, arrayItemValidator, "an array");

        property.expectArray = true;

        if (subValidator !== undefined)
        {
            if (_.isFunction(subValidator))
            {
                const v = Validator.create(this.path());

                property.itemValidator = subValidator(v);
            }
            else
            {
                property.itemValidator = subValidator.clone(this.path());
            }
        }

        return this;
    }

    object(propertyName, objectValidator)
    {
        const {property, subValidator} = this.__collection(propertyName, objectValidator, "an object");

        property.expectObject = true;

        if (subValidator !== undefined)
        {
            if (_.isFunction(subValidator))
            {
                const v = Validator.create(this.path());

                property.objectValidator = subValidator(v);
            }
            else
            {
                property.objectValidator = subValidator.clone(this.path());
            }
        }

        return this;
    }

    mapping(propertyName, mappingValueValidator)
    {
        const {property, subValidator} = this.__collection(propertyName, mappingValueValidator, "a mapping");

        property.expectMapping = true;

        if (subValidator !== undefined)
        {
            if (_.isFunction(subValidator))
            {
                const v = Validator.create(this.path());

                property.mappingValueValidator = subValidator(v);
            }
            else
            {
                property.mappingValueValidator = subValidator.clone(this.path());
            }
        }

        return this;
    }
    
    intercept(interceptor)
    {
        if (!_.isFunction(interceptor))
        {
            throw new Error("Interceptors must be functions");      
        }

        const property = this.__updateProperty("Only properties may be intercepted");

        property.interceptValidation = interceptor;

        return this;
    }

    is(propertyName, typeValidator)
    {
        const {property, subValidator} = this.__collection(propertyName, typeValidator, "a typed instance");

        property.expectIs = property.expectIs || [];
        property.expectIs.push(subValidator);

        return this;
    }

    __uniqueDefault(p, uniqueCriteria)
    {
        if (uniqueCriteria !== undefined)
        {
            return false;
        }

        const path = this.path();

        p.uniqueCriteria = (item) => {
            const ci = toComparable(item);

            validate(path).isImmutable(ci, "Only immutable items can be placed in unique properties using default uniqueness");
    
            return ci;
        };

        return true;
    }

    __uniqueString(p, uniqueCriteria)
    {
        if (!_.isString(uniqueCriteria))
        {
            return false;
        }

        const path = this.path();

        p.uniqueCriteria = (item) => {
            let value = item[uniqueCriteria];

            value = toComparable(value);

            validate(path).isImmutable(value, "Only immutable items can be placed in unique properties");

            return value;
        };

        return true;
    }    

    __uniqueFunc(p, uniqueCriteria)
    {
        if (!_.isFunction(uniqueCriteria))
        {
            return false;
        }

        const path = this.path();

        p.uniqueCriteria = (item) => {
            let value = uniqueCriteria(item);

            value = toComparable(value);

            validate(path).isImmutable(value, "Only immutable items can be placed in unique properties");

            return value;
        };

        return true;
    }
    
    unique(uniqueCriteria, msg)
    {
        const p = this.__updateProperty("Only properties may have unique criteria");
        
        if (p.expectArray !== true)
        {
            throw new Error("Only arrays can be declared to have unique children");
        }

        const set = this.__uniqueDefault(p, uniqueCriteria) ||
            this.__uniqueString(p, uniqueCriteria) ||
            this.__uniqueFunc(p, uniqueCriteria);

        if (!set)
        {
            throw new Error("Unique criteria can only be specified on array-item object properties or immutable array-items");
        }

        p.expectUniqueCollection = true;
        p.uniqueCriteriaMsg = msg;

        return this;
    }

    check(props)
    {
        return this.compiled().check(props);
    }

    __readProperty(msg)
    {
        const property = this.property();

        if (property === undefined)
        {
            throw new Error(msg);
        }

        return property;
    }

    __updateProperty(msg)
    {
        const property = this.__readProperty(msg);

        this.__compiled = null;

        return property;
    }

    compiled(value)
    {
        if (value === undefined)
        {
            if (this.__compiled === null)
            {
                this.__compiled = compile(this.__storage, this.__identifier, validate);
            }

            return this.__compiled;
        }

        this.__compiled = value;

        return this;
    }
}
