"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleFactory = void 0;
const promo_rule_1 = require("../../domain/entities/promo-rule");
const post_calc_rule_1 = require("../../domain/entities/post-calc-rule");
const promo_code_types_1 = require("../../domain/entities/promo-code.types");
class RuleFactory {
    static minPurchase(minAmount) {
        return new promo_rule_1.PromoRule(promo_code_types_1.RuleType.MIN_PURCHASE_AMOUNT, { minAmount });
    }
    static eligibleCategories(categoryIds) {
        return new promo_rule_1.PromoRule(promo_code_types_1.RuleType.ELIGIBLE_CATEGORIES, { categoryIds });
    }
    static firstOrderOnly() {
        return new promo_rule_1.PromoRule(promo_code_types_1.RuleType.FIRST_ORDER_ONLY, {});
    }
    static userUsageLimit(limit) {
        return new promo_rule_1.PromoRule(promo_code_types_1.RuleType.USER_USAGE_LIMIT, { limit });
    }
    static globalUsageLimit(limit) {
        return new promo_rule_1.PromoRule(promo_code_types_1.RuleType.GLOBAL_USAGE_LIMIT, { limit });
    }
    static globalAmountLimit(maxTotalAmount) {
        return new promo_rule_1.PromoRule(promo_code_types_1.RuleType.GLOBAL_AMOUNT_LIMIT, { maxTotalAmount });
    }
    static restrictedUsage() {
        return new promo_rule_1.PromoRule(promo_code_types_1.RuleType.RESTRICTED_USAGE, {});
    }
    static maxDiscount(maxAmount) {
        return new post_calc_rule_1.PostCalcRule(promo_code_types_1.PostCalcRuleType.MAX_DISCOUNT_AMOUNT, { maxAmount });
    }
}
exports.RuleFactory = RuleFactory;
//# sourceMappingURL=rule.factory.js.map