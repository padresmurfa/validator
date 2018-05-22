'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assume = require('@padresmurfa/assume');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValidationFailed = function (_AssumptionFailed) {
  _inherits(ValidationFailed, _AssumptionFailed);

  function ValidationFailed() {
    _classCallCheck(this, ValidationFailed);

    return _possibleConstructorReturn(this, (ValidationFailed.__proto__ || Object.getPrototypeOf(ValidationFailed)).apply(this, arguments));
  }

  return ValidationFailed;
}(_assume.AssumptionFailed);

exports.default = ValidationFailed;