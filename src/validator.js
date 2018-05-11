import moment from 'moment';
import _ from 'lodash';

import binding from '@padresmurfa/binding';

import assume, { Assume, normalizeClassNames } from '@padresmurfa/assume';

import compile from './compiler';
import ValidationFailed from './validation-failed';

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

    property(propertyName)
    {
        if (propertyName === undefined)
        {
            return this.__storage[this.__propertyName] || null;
        }
        else if (this.__propertyName !== propertyName)
        {
            this.__propertyName = propertyName;
            if (this.__storage[propertyName] === undefined)
            {
                this.__storage[propertyName] = {};
            }
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
        else
        {
            return this.__identifier + "/" + this.__propertyName;
        }
    }

    clone(variant)
    {
        if ((!_.isString(variant)) || (isWhiteSpace(variant)))
        {
            throw new Error("Clones must have a variant name");
        }

        return new Validator(this.path() + ":" + variant);
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

    array(propertyName, arrayItemValidator)
    {
        if (propertyName !== undefined)
        {
            if (_.isFunction(propertyName))
            {
                arrayItemValidator = propertyName;
            }
            else
            {
                this.property(propertyName);
            }
        }

        const property = this.__updateProperty("Only properties may be expected to be an array");
        property.expectArray = true;
        property.expectNullable = false;
        if (arrayItemValidator !== undefined)
        {
            const v = Validator.create(this.path()).property(":array-item").optional();
            property.itemValidator = arrayItemValidator(v);
        }

        return this;
    }

    __self()
    {
        return this;
    }

    object(propertyName, objectValidator)
    {
        if (propertyName !== undefined)
        {
            if (_.isFunction(propertyName))
            {
                objectValidator = propertyName;
            }
            else
            {
                this.property(propertyName);
            }
        }
        
        const property = this.__updateProperty("Only properties may be expected to be an object");
        property.expectObject = true;
        property.expectNullable = false;
        if (objectValidator !== undefined)
        {
            const v = Validator.create(this.path()).property(":self");
            property.objectValidator = objectValidator(v);
        }
        return this;
    }

    instanceOf(propertyName, classNames)
    {
        if (propertyName !== undefined)
        {
            if (_.isUndefined(classNames))
            {
                classNames = propertyName;
            }
            else
            {
                this.object(propertyName);
            }
        }
        
        const property = this.__updateProperty("Only properties may be expected to be instances");
        property.expectInstanceOf = normalizeClassNames(classNames);
        return this;
    }

    unique(uniqueCriteria, msg)
    {
        const p = this.__updateProperty("Only properties may have unique criteria");
        
        if (p.expectArray !== true)
        {
            throw new Error("Only arrays can be declared to have unique children");
        }

        if (uniqueCriteria === undefined)
        {
            const path = this.path();
            p.expectUniqueCollection = true;
            p.uniqueCriteria = (item) => {
                item = toComparable(item);
                validate(path).isImmutable(item, "Only immutable items can be placed in unique properties using default uniqueness");
                return item;
            };
        }
        else if (_.isString(uniqueCriteria))
        {
            const path = this.path();
            p.expectUniqueCollection = true;
            p.uniqueCriteria = (item) => {
                let value = item[uniqueCriteria];
                value = toComparable(value);
                validate(path).isImmutable(value, "Only immutable items can be placed in unique properties");
                return value;
            };
        }
        else if (_.isFunction(uniqueCriteria))
        {
            const path = this.path();
            p.expectUniqueCollection = true;
            p.uniqueCriteria = (item) => {
                let value = uniqueCriteria(item);
                value = toComparable(value);
                validate(path).isImmutable(value, "Only immutable items can be placed in unique properties");
                return value;
            };
        }
        else
        {
            throw new Error("Unique criteria can only be specified on array-item object properties or immutable array-items");
        }

        if (msg !== undefined)
        {
            p.uniqueCriteriaMsg = msg;
        }

        return this;
    }

    check(props)
    {
        assume.isInstanceOf(this, "Validator", "Check called with incorrect this pointer.  Expected a Validator");

        return this.compiled().check(props);
    }

    __readProperty(msg)
    {
        const property = this.property();
        if (property === null)
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
                this.__compiled = compile(this.__storage, this.__identifier, validate );
            }
            return this.__compiled;
        }
        else
        {
            this.__compiled = value;
            return this;
        }
    }

}
