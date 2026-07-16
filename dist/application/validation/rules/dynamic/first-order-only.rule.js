"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirstOrderOnlyRule = void 0;
const validation_rule_1 = require("../validation-rule");
const validation_result_1 = require("../../../../domain/value-objects/validation-result");
const error_codes_1 = require("../../../../domain/errors/error-codes");
const promo_code_types_1 = require("../../../../domain/entities/promo-code.types");
class FirstOrderOnlyRule extends validation_rule_1.ValidationRule {
    async validate(context) {
        const rule = context.promo?.getRule(promo_code_types_1.RuleType.FIRST_ORDER_ONLY);
        if (!rule)
            return validation_result_1.ValidationResult.success();
        if (!context.buyer.isFirstBuyer) {
            return validation_result_1.ValidationResult.failure(error_codes_1.ErrorCode.CODE_ALREADY_USED);
        }
        return validation_result_1.ValidationResult.success();
    }
}
exports.FirstOrderOnlyRule = FirstOrderOnlyRule;
//# sourceMappingURL=first-order-only.rule.js.map