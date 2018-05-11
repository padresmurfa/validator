'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _binding = require('@padresmurfa/binding');

var _binding2 = _interopRequireDefault(_binding);

var _assume = require('@padresmurfa/assume');

var _assume2 = _interopRequireDefault(_assume);

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _validationFailed = require('./validation-failed');

var _validationFailed2 = _interopRequireDefault(_validationFailed);

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
        key: 'property',
        value: function property(propertyName) {
            if (propertyName === undefined) {
                return this.__storage[this.__propertyName] || null;
            } else if (this.__propertyName !== propertyName) {
                this.__propertyName = propertyName;
                if (this.__storage[propertyName] === undefined) {
                    this.__storage[propertyName] = {};
                }
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
            } else {
                return this.__identifier + "/" + this.__propertyName;
            }
        }
    }, {
        key: 'clone',
        value: function clone(variant) {
            if (!_lodash2.default.isString(variant) || isWhiteSpace(variant)) {
                throw new Error("Clones must have a variant name");
            }

            return new Validator(this.path() + ":" + variant);
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
        key: 'array',
        value: function array(propertyName, arrayItemValidator) {
            if (propertyName !== undefined) {
                if (_lodash2.default.isFunction(propertyName)) {
                    arrayItemValidator = propertyName;
                } else {
                    this.property(propertyName);
                }
            }

            var property = this.__updateProperty("Only properties may be expected to be an array");
            property.expectArray = true;
            property.expectNullable = false;
            if (arrayItemValidator !== undefined) {
                var v = Validator.create(this.path()).property(":array-item").optional();
                property.itemValidator = arrayItemValidator(v);
            }

            return this;
        }
    }, {
        key: '__self',
        value: function __self() {
            return this;
        }
    }, {
        key: 'object',
        value: function object(propertyName, objectValidator) {
            if (propertyName !== undefined) {
                if (_lodash2.default.isFunction(propertyName)) {
                    objectValidator = propertyName;
                } else {
                    this.property(propertyName);
                }
            }

            var property = this.__updateProperty("Only properties may be expected to be an object");
            property.expectObject = true;
            property.expectNullable = false;
            if (objectValidator !== undefined) {
                var v = Validator.create(this.path()).property(":self");
                property.objectValidator = objectValidator(v);
            }
            return this;
        }
    }, {
        key: 'instanceOf',
        value: function instanceOf(propertyName, classNames) {
            if (propertyName !== undefined) {
                if (_lodash2.default.isUndefined(classNames)) {
                    classNames = propertyName;
                } else {
                    this.object(propertyName);
                }
            }

            var property = this.__updateProperty("Only properties may be expected to be instances");
            property.expectInstanceOf = (0, _assume.normalizeClassNames)(classNames);
            return this;
        }
    }, {
        key: 'unique',
        value: function unique(uniqueCriteria, msg) {
            var p = this.__updateProperty("Only properties may have unique criteria");

            if (p.expectArray !== true) {
                throw new Error("Only arrays can be declared to have unique children");
            }

            if (uniqueCriteria === undefined) {
                var path = this.path();
                p.expectUniqueCollection = true;
                p.uniqueCriteria = function (item) {
                    item = toComparable(item);
                    validate(path).isImmutable(item, "Only immutable items can be placed in unique properties using default uniqueness");
                    return item;
                };
            } else if (_lodash2.default.isString(uniqueCriteria)) {
                var _path = this.path();
                p.expectUniqueCollection = true;
                p.uniqueCriteria = function (item) {
                    var value = item[uniqueCriteria];
                    value = toComparable(value);
                    validate(_path).isImmutable(value, "Only immutable items can be placed in unique properties");
                    return value;
                };
            } else if (_lodash2.default.isFunction(uniqueCriteria)) {
                var _path2 = this.path();
                p.expectUniqueCollection = true;
                p.uniqueCriteria = function (item) {
                    var value = uniqueCriteria(item);
                    value = toComparable(value);
                    validate(_path2).isImmutable(value, "Only immutable items can be placed in unique properties");
                    return value;
                };
            } else {
                throw new Error("Unique criteria can only be specified on array-item object properties or immutable array-items");
            }

            if (msg !== undefined) {
                p.uniqueCriteriaMsg = msg;
            }

            return this;
        }
    }, {
        key: 'check',
        value: function check(props) {
            _assume2.default.isInstanceOf(this, "Validator", "Check called with incorrect this pointer.  Expected a Validator");

            return this.compiled().check(props);
        }
    }, {
        key: '__readProperty',
        value: function __readProperty(msg) {
            var property = this.property();
            if (property === null) {
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
            } else {
                this.__compiled = value;
                return this;
            }
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