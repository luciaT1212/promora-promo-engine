"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinPurchaseAmountRule = void 0;
const validation_rule_1 = require("../validation-rule");
const validation_result_1 = require("../../../../domain/value-objects/validation-result");
const error_codes_1 = require("../../../../domain/errors/error-codes");
const promo_code_types_1 = require("../../../../domain/entities/promo-code.types");
class MinPurchaseAmountRule extends validation_rule_1.ValidationRule {
    async validate(context) {
        const rule = context.promo?.getRule(promo_code_types_1.RuleType.MIN_PURCHASE_AMOUNT);
        if (!rule)
            return validation_result_1.ValidationResult.success();
        const minAmount = Number(rule.parameters.minAmount ?? 0);
        if (context.order.getSubtotal() < minAmount) {
            return validation_result_1.ValidationResult.failure(error_codes_1.ErrorCode.MIN_AMOUNT_REQUIRED);
        }
        return validation_result_1.ValidationResult.success();
    }
}
exports.MinPurchaseAmountRule = MinPurchaseAmountRule;
//# sourceMappingURL=min-purchase-amount.rule.js.map