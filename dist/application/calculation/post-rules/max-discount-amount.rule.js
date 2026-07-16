"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxDiscountAmountRule = void 0;
const promo_code_types_1 = require("../../../domain/entities/promo-code.types");
class MaxDiscountAmountRule {
    apply(promo, discount) {
        const rule = promo.postCalcRules.find((r) => r.ruleType === promo_code_types_1.PostCalcRuleType.MAX_DISCOUNT_AMOUNT && r.isActive);
        if (!rule)
            return discount;
        const maxAmount = Number(rule.parameters.maxAmount ?? 0);
        return Math.min(discount, maxAmount);
    }
}
exports.MaxDiscountAmountRule = MaxDiscountAmountRule;
//# sourceMappingURL=max-discount-amount.rule.js.map