'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _assume = require('@padresmurfa/assume');

var _assume2 = _interopRequireDefault(_assume);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compiled = function () {
    function Compiled(property) {
        _classCallCheck(this, Compiled);

        this.checks = [];
        this.property = property;
    }

    _createClass(Compiled, [{
        key: 'check',
        value: function check(value) {
            var _this = this;

            _lodash2.default.forEach(this.checks, function (check) {

                var v = value;

                if (check.propName !== "$") {
                    v = v[check.propName];
                }
                _this.checkProperty(check, v);
            });
        }
    }, {
        key: 'checkProperty',
        value: function checkProperty(check, propertyValue) {
            var isNullable = this.property[check.propName].expectNullable === true;
            var isOptional = this.property[check.propName].expectDefined === false;

            if (propertyValue === null && isNullable) {
                return;
            }
            if (propertyValue === undefined && isOptional) {
                return;
            }
            check.method(propertyValue);
        }
    }, {
        key: 'add',
        value: function add(propName, condition, method) {
            this.checks.push({
                condition: condition,
                method: method,
                propName: propName
            });
        }
    }]);

    return Compiled;
}();

var Compiler = function () {
    function Compiler() {
        _classCallCheck(this, Compiler);
    }

    _createClass(Compiler, null, [{
        key: 'compile',


        /* eslint-disable complexity, max-statements */

        // TODO: prevent inconsistent declarations during construction
        //       and set up the asserts beforehand

        value: function compile(property, identifier, assumptionEngineFactory) {
            _assume2.default.isObject(property, "Can only check known properties of objects");

            var c = new Compiled(property);

            _lodash2.default.forEach(property, function (p, propName) {

                var ae = assumptionEngineFactory(identifier + "/" + propName);

                if (p.interceptValidation !== undefined) {
                    c.add(propName, "intercept", function () {

                        var ret = p.interceptValidation.apply(p, arguments);

                        ae.isTrue(ret, ret);
                    });
                }
                if (p.expectUndefined === true) {
                    c.add(propName, "isUndefined", ae.isUndefined);
                }
                if (p.expectDefined === true) {
                    c.add(propName, "isDefined", ae.isDefined);
                }
                if (p.expectNotEmpty === true) {
                    c.add(propName, "isNotEmpty", ae.isNotEmpty);
                }
                if (p.expectEmpty === true) {
                    c.add(propName, "isEmpty", ae.isEmpty);
                }
                if (p.expectTrue === true) {
                    c.add(propName, "isTrue", ae.isTrue);
                }
                if (p.expectFalse === true) {
                    c.add(propName, "isFalse", ae.isFalse);
                }
                if (p.expectString === true) {
                    c.add(propName, "isString", ae.isString);
                }
                if (p.expectArray === true) {
                    c.add(propName, "isArray", ae.isArray);
                }
                if (p.expectDate === true) {
                    c.add(propName, "isDate", ae.isDate);
                }
                if (p.expectInteger === true) {
                    c.add(propName, "isInteger", ae.isInteger);
                }
                if (p.expectBoolean === true) {
                    c.add(propName, "isBoolean", ae.isBoolean);
                }
                if (p.expectObject === true) {
                    c.add(propName, "isObject", ae.isObject);
                }
                if (p.expectMapping === true) {
                    // mappings are objects where the key is not fixed
                    // TODO: proper error message on failure
                    c.add(propName, "isMapping", ae.isObject);
                }
                if (p.expectIsoDate === true) {
                    c.add(propName, "isIsoDate", ae.isIsoDate);
                }
                if (p.expectImmutable === true) {
                    c.add(propName, "isImmutable", ae.isImmutable);
                }
                if (p.itemValidator !== undefined) {
                    c.add(propName, "isArrayItem", function (v) {
                        _lodash2.default.forEach(v, function (item) {
                            p.itemValidator.check(item);
                        });
                    });
                }
                if (p.mappingValueValidator !== undefined) {
                    c.add(propName, "isMappingValue", function (v) {
                        _lodash2.default.forEach(v, function (item) {
                            p.mappingValueValidator.check(item);
                        });
                    });
                }
                if (p.objectValidator !== undefined) {
                    c.add(propName, "isObject", p.objectValidator.check.bind(p.objectValidator));
                }
                if (p.uniqueCriteria !== undefined) {
                    c.add(propName, "isUnique", function (v) {
                        var vl = v.length;
                        var ol = _lodash2.default.uniqBy(v, p.uniqueCriteria).length;
                        var msg = p.uniqueCriteriaMsg || "Expected a collection of unique items";

                        ae.areEqual(vl, ol, msg);
                    });
                }
                if (p.expectIs !== undefined) {
                    _lodash2.default.forEach(p.expectIs, function (is) {
                        c.add(propName, "is", is.check.bind(is));
                    });
                }
            });

            return c;
        }

        /* eslint-enable complexity, max-statements */

    }]);

    return Compiler;
}();

exports.default = Compiler.compile;