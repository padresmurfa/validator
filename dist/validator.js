'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _validationFailed = require('./validation-failed');

var _validationFailed2 = _interopRequireDefault(_validationFailed);

var _assume = require('@padresmurfa/assume');

var _binding = require('@padresmurfa/binding');

var _binding2 = _interopRequireDefault(_binding);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isWhiteSpace(params) {
    if (/\S/.test(params)) {
        // string is not empty and not just whitespace
        return false;
    }

    return true;
}

function validate(path) {
    return _binding2.default.JIT(_assume.Assume, function (msg) {
        var failureMsg = path + ': ' + msg;

        return new _validationFailed2.default(failureMsg);
    });
}

function toComparable(item) {
    if (_lodash2.default.isDate(item)) {
        return item.getTime();
    }

    return item;
}

var Validator = function () {
    function Validator(identifier) {
        _classCallCheck(this, Validator);

        this.__identifier = identifier;
        this.__propertyName = null;
        this.__storage = {};
        this.__compiled = null;
    }

    _createClass(Validator, [{
        key: '__propertyPn',
        value: function __propertyPn(propertyName) {
            var pn = propertyName;

            if (pn === null) {
                pn = "$";
            }

            if (this.__storage[pn] === undefined) {
                this.__storage[pn] = {};
            }

            return pn;
        }
    }, {
        key: 'property',
        value: function property(propertyName) {
            if (propertyName === undefined) {
                var pn = this.__propertyPn(this.__propertyName);

                return this.__storage[pn];
            } else if (this.__propertyName !== propertyName) {
                this.__propertyName = this.__propertyPn(propertyName);
                // properties are required by default
                this.required();
            }

            return this;
        }
    }, {
        key: 'hasProperty',
        value: function hasProperty(propertyName) {
            return this.__storage[propertyName] !== undefined;
        }
    }, {
        key: 'path',
        value: function path() {
            if (this.__propertyName === null) {
                return this.__identifier;
            }

            return this.__identifier + "/" + this.__propertyName;
        }
    }, {
        key: 'clone',
        value: function clone(variant) {
            if (!_lodash2.default.isString(variant) || isWhiteSpace(variant)) {
                throw new Error("Clones must have a variant name");
            }

            var retval = new Validator(variant);

            retval.propertyName = this.__propertyName;
            retval.__storage = _lodash2.default.cloneDeep(this.__storage);

            return retval;
        }
    }, {
        key: 'immutable',
        value: function immutable(propertyName) {
            if (propertyName !== undefined) {
                this.property(propertyName);
            }

            var property = this.__updateProperty("Only properties may be expected to be immutable");

            property.expectImmutable = true;

            return this;
        }
    }, {
        key: 'string',
        value: function string(propertyName) {
            if (propertyName !== undefined) {
                this.property(propertyName);
            }

            var property = this.__updateProperty("Only properties may be expected to be strings");

            property.expectString = true;
            property.expectImmutable = true;
            property.expectNullable = false;

            return this;
        }
    }, {
        key: 'integer',
        value: function integer(propertyName) {
            if (propertyName !== undefined) {
                this.property(propertyName);
            }

            var property = this.__updateProperty("Only properties may be expected to be integers");

            property.expectInteger = true;
            property.expectImmutable = true;
            property.expectNullable = false;

            return this;
        }
    }, {
        key: 'boolean',
        value: function boolean(propertyName) {
            if (propertyName !== undefined) {
                this.property(propertyName);
            }

            var property = this.__updateProperty("Only properties may be expected to be booleans");

            property.expectBoolean = true;
            property.expectImmutable = true;
            property.expectNullable = false;

            return this;
        }
    }, {
        key: 'isTrue',
        value: function isTrue(propertyName) {
            if (propertyName !== undefined) {
                this.boolean(propertyName);
            }

            var property = this.__updateProperty("Only properties may be expected to be true");

            property.expectTrue = true;

            return this;
        }
    }, {
        key: 'isFalse',
        value: function isFalse(propertyName) {
            if (propertyName !== undefined) {
                this.boolean(propertyName);
            }

            var property = this.__updateProperty("Only properties may be expected to be true");

            property.expectFalse = true;

            return this;
        }
    }, {
        key: 'date',
        value: function date(propertyName) {
            if (propertyName !== undefined) {
                this.property(propertyName);
            }

            var property = this.__updateProperty("Only properties may be expected to be dates");

            property.expectDate = true;
            property.expectNullable = false;

            return this;
        }
    }, {
        key: 'isoDate',
        value: function isoDate(propertyName) {
            if (propertyName !== undefined) {
                this.property(propertyName);
            }

            var property = this.__updateProperty("Only properties may be expected to be ISO dates");

            property.expectIsoDate = true;
            property.expectImmutable = true;
            property.expectNullable = false;

            return this;
        }
    }, {
        key: 'required',
        value: function required(propertyName) {
            if (propertyName !== undefined) {
                this.property(propertyName);
            }

            var property = this.__updateProperty("Only properties may be expected to be defined");

            property.expectDefined = true;
            property.expectUndefined = false;

            return this;
        }
    }, {
        key: 'absent',
        value: function absent(propertyName) {
            if (propertyName !== undefined) {
                this.property(propertyName);
            }

            var property = this.__updateProperty("Only properties may be expected to be undefined");

            property.expectDefined = false;
            property.expectUndefined = true;

            return this;
        }
    }, {
        key: 'optional',
        value: function optional(propertyName) {
            if (propertyName !== undefined) {
                this.property(propertyName);
            }

            var property = this.__updateProperty("Only properties may be expected to be optionally defined");

            property.expectDefined = false;
            property.expectUndefined = false;

            return this;
        }
    }, {
        key: 'nullable',
        value: function nullable(propertyName) {
            if (propertyName !== undefined) {
                this.property(propertyName);
            }

            var property = this.__updateProperty("Only properties may be expected to be nullable");

            property.expectNullable = true;

            return this;
        }
    }, {
        key: 'empty',
        value: function empty(propertyName) {
            if (propertyName !== undefined) {
                this.property(propertyName);
            }

            var property = this.__updateProperty("Only properties may be expected to be empty");

            property.expectEmpty = true;

            return this;
        }
    }, {
        key: 'notEmpty',
        value: function notEmpty(propertyName) {
            if (propertyName !== undefined) {
                this.property(propertyName);
            }

            var property = this.__updateProperty("Only properties may be expected to be not empty");

            property.expectNotEmpty = true;

            return this;
        }
    }, {
        key: '__collection',
        value: function __collection(propertyName, ciValidator, wat) {
            var pn = propertyName;
            var subValidator = ciValidator;

            if (pn !== undefined) {
                if (subValidator === undefined && !_lodash2.default.isString(pn)) {
                    subValidator = pn;
                    pn = undefined;
                } else {
                    this.property(pn);
                }
            }

            var property = this.__updateProperty('Only properties may be expected to be ' + wat);

            property.expectNullable = false;

            return {
                property: property,
                subValidator: subValidator
            };
        }
    }, {
        key: 'array',
        value: function array(propertyName, arrayItemValidator) {
            var _collection = this.__collection(propertyName, arrayItemValidator, "an array"),
                property = _collection.property,
                subValidator = _collection.subValidator;

            property.expectArray = true;

            if (subValidator !== undefined) {
                if (_lodash2.default.isFunction(subValidator)) {
                    var v = Validator.create(this.path());

                    property.itemValidator = subValidator(v);
                } else {
                    property.itemValidator = subValidator.clone(this.path());
                }
            }

            return this;
        }
    }, {
        key: 'object',
        value: function object(propertyName, objectValidator) {
            var _collection2 = this.__collection(propertyName, objectValidator, "an object"),
                property = _collection2.property,
                subValidator = _collection2.subValidator;

            property.expectObject = true;

            if (subValidator !== undefined) {
                if (_lodash2.default.isFunction(subValidator)) {
                    var v = Validator.create(this.path());

                    property.objectValidator = subValidator(v);
                } else {
                    property.objectValidator = subValidator.clone(this.path());
                }
            }

            return this;
        }
    }, {
        key: 'mapping',
        value: function mapping(propertyName, mappingValueValidator) {
            var _collection3 = this.__collection(propertyName, mappingValueValidator, "a mapping"),
                property = _collection3.property,
                subValidator = _collection3.subValidator;

            property.expectMapping = true;

            if (subValidator !== undefined) {
                if (_lodash2.default.isFunction(subValidator)) {
                    var v = Validator.create(this.path());

                    property.mappingValueValidator = subValidator(v);
                } else {
                    property.mappingValueValidator = subValidator.clone(this.path());
                }
            }

            return this;
        }
    }, {
        key: 'intercept',
        value: function intercept(interceptor) {
            if (!_lodash2.default.isFunction(interceptor)) {
                throw new Error("Interceptors must be functions");
            }

            var property = this.__updateProperty("Only properties may be intercepted");

            property.interceptValidation = interceptor;

            return this;
        }
    }, {
        key: 'is',
        value: function is(propertyName, typeValidator) {
            var _collection4 = this.__collection(propertyName, typeValidator, "a typed instance"),
                property = _collection4.property,
                subValidator = _collection4.subValidator;

            property.expectIs = property.expectIs || [];
            property.expectIs.push(subValidator);

            return this;
        }
    }, {
        key: '__uniqueDefault',
        value: function __uniqueDefault(p, uniqueCriteria) {
            if (uniqueCriteria !== undefined) {
                return false;
            }

            var path = this.path();

            p.uniqueCriteria = function (item) {
                var ci = toComparable(item);

                validate(path).isImmutable(ci, "Only immutable items can be placed in unique properties using default uniqueness");

                return ci;
            };

            return true;
        }
    }, {
        key: '__uniqueString',
        value: function __uniqueString(p, uniqueCriteria) {
            if (!_lodash2.default.isString(uniqueCriteria)) {
                return false;
            }

            var path = this.path();

            p.uniqueCriteria = function (item) {
                var value = item[uniqueCriteria];

                value = toComparable(value);

                validate(path).isImmutable(value, "Only immutable items can be placed in unique properties");

                return value;
            };

            return true;
        }
    }, {
        key: '__uniqueFunc',
        value: function __uniqueFunc(p, uniqueCriteria) {
            if (!_lodash2.default.isFunction(uniqueCriteria)) {
                return false;
            }

            var path = this.path();

            p.uniqueCriteria = function (item) {
                var value = uniqueCriteria(item);

                value = toComparable(value);

                validate(path).isImmutable(value, "Only immutable items can be placed in unique properties");

                return value;
            };

            return true;
        }
    }, {
        key: 'unique',
        value: function unique(uniqueCriteria, msg) {
            var p = this.__updateProperty("Only properties may have unique criteria");

            if (p.expectArray !== true) {
                throw new Error("Only arrays can be declared to have unique children");
            }

            var set = this.__uniqueDefault(p, uniqueCriteria) || this.__uniqueString(p, uniqueCriteria) || this.__uniqueFunc(p, uniqueCriteria);

            if (!set) {
                throw new Error("Unique criteria can only be specified on array-item object properties or immutable array-items");
            }

            p.expectUniqueCollection = true;
            p.uniqueCriteriaMsg = msg;

            return this;
        }
    }, {
        key: 'check',
        value: function check(props) {
            return this.compiled().check(props);
        }
    }, {
        key: '__readProperty',
        value: function __readProperty(msg) {
            var property = this.property();

            if (property === undefined) {
                throw new Error(msg);
            }

            return property;
        }
    }, {
        key: '__updateProperty',
        value: function __updateProperty(msg) {
            var property = this.__readProperty(msg);

            this.__compiled = null;

            return property;
        }
    }, {
        key: 'compiled',
        value: function compiled(value) {
            if (value === undefined) {
                if (this.__compiled === null) {
                    this.__compiled = (0, _compiler2.default)(this.__storage, this.__identifier, validate);
                }

                return this.__compiled;
            }

            this.__compiled = value;

            return this;
        }
    }], [{
        key: 'create',
        value: function create() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return new (Function.prototype.bind.apply(Validator, [null].concat(args)))();
        }
    }]);

    return Validator;
}();

exports.default = Validator;