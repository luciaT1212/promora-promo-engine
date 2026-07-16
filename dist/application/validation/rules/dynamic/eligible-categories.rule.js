"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibleCategoriesRule = void 0;
const validation_rule_1 = require("../validation-rule");
const validation_result_1 = require("../../../../domain/value-objects/validation-result");
const error_codes_1 = require("../../../../domain/errors/error-codes");
const promo_code_types_1 = require("../../../../domain/entities/promo-code.types");
class EligibleCategoriesRule extends validation_rule_1.ValidationRule {
    async validate(context) {
        const rule = context.promo?.getRule(promo_code_types_1.RuleType.ELIGIBLE_CATEGORIES);
        if (!rule)
            return validation_result_1.ValidationResult.success();
        const categoryIds = rule.parameters.categoryIds ?? [];
        const orderCategory = context.order.getOrderContext().categoryId;
        if (!categoryIds.includes(orderCategory)) {
            return validation_result_1.ValidationResult.failure(error_codes_1.ErrorCode.INVALID_CODE);
        }
        return validation_result_1.ValidationResult.success();
    }
}
exports.EligibleCategoriesRule = EligibleCategoriesRule;
//# sourceMappingURL=eligible-categories.rule.js.map