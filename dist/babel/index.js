'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ValidationFailed = exports.Validator = undefined;

var _validator = require('./validator');

var _validator2 = _interopRequireDefault(_validator);

var _validationFailed = require('./validation-failed');

var _validationFailed2 = _interopRequireDefault(_validationFailed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _validator2.default.create;
exports.Validator = _validator2.default;
exports.ValidationFailed = _validationFailed2.default;