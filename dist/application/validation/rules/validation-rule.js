"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationRule = void 0;
const validation_result_1 = require("../../../domain/value-objects/validation-result");
class ValidationRule {
    next = null;
    setNext(rule) {
        this.next = rule;
        return rule;
    }
    async handle(context) {
        const result = await this.validate(context);
        if (!result.isValid)
            return result;
        if (this.next)
            return this.next.handle(context);
        return validation_result_1.ValidationResult.success();
    }
}
exports.ValidationRule = ValidationRule;
//# sourceMappingURL=validation-rule.js.map