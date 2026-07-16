"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationResult = void 0;
class ValidationResult {
    _isValid;
    _errors;
    constructor(isValid, errors = []) {
        this._isValid = isValid;
        this._errors = errors;
    }
    get isValid() {
        return this._isValid;
    }
    get errors() {
        return this._errors;
    }
    get firstError() {
        return this._errors.length > 0 ? this._errors[0] : null;
    }
    addError(code) {
        this._errors.push(code);
        this._isValid = false;
    }
    static success() {
        return new ValidationResult(true, []);
    }
    static failure(code) {
        return new ValidationResult(false, [code]);
    }
}
exports.ValidationResult = ValidationResult;
//# sourceMappingURL=validation-result.js.map