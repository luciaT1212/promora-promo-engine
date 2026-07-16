"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationRuleFactory = void 0;
const min_purchase_amount_rule_1 = require("../validation/rules/dynamic/min-purchase-amount.rule");
const eligible_categories_rule_1 = require("../validation/rules/dynamic/eligible-categories.rule");
const first_order_only_rule_1 = require("../validation/rules/dynamic/first-order-only.rule");
const user_usage_limit_rule_1 = require("../validation/rules/dynamic/user-usage-limit.rule");
const global_usage_limit_rule_1 = require("../validation/rules/dynamic/global-usage-limit.rule");
const global_amount_limit_rule_1 = require("../validation/rules/dynamic/global-amount-limit.rule");
const restricted_usage_rule_1 = require("../validation/rules/dynamic/restricted-usage.rule");
const promo_code_types_1 = require("../../domain/entities/promo-code.types");
class ValidationRuleFactory {
    usageRepo;
    restrictedRepo;
    constructor(usageRepo, restrictedRepo) {
        this.usageRepo = usageRepo;
        this.restrictedRepo = restrictedRepo;
    }
    createRule(type) {
        switch (type) {
            case promo_code_types_1.RuleType.MIN_PURCHASE_AMOUNT:
                return new min_purchase_amount_rule_1.MinPurchaseAmountRule();
            case promo_code_types_1.RuleType.ELIGIBLE_CATEGORIES:
                return new eligible_categories_rule_1.EligibleCategoriesRule();
            case promo_code_types_1.RuleType.FIRST_ORDER_ONLY:
                return new first_order_only_rule_1.FirstOrderOnlyRule();
            case promo_code_types_1.RuleType.USER_USAGE_LIMIT:
                return new user_usage_limit_rule_1.UserUsageLimitRule(this.usageRepo);
            case promo_code_types_1.RuleType.GLOBAL_USAGE_LIMIT:
                return new global_usage_limit_rule_1.GlobalUsageLimitRule(this.usageRepo);
            case promo_code_types_1.RuleType.GLOBAL_AMOUNT_LIMIT:
                return new global_amount_limit_rule_1.GlobalAmountLimitRule(this.usageRepo);
            case promo_code_types_1.RuleType.RESTRICTED_USAGE:
                return new restricted_usage_rule_1.RestrictedUsageRule(this.restrictedRepo);
            default:
                throw new Error(`Unknown rule type: ${type}`);
        }
    }
    createRules(types) {
        return types.map((t) => this.createRule(t));
    }
}
exports.ValidationRuleFactory = ValidationRuleFactory;
//# sourceMappingURL=validation-rule.factory.js.map