"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalAmountLimitRule = void 0;
const validation_rule_1 = require("../validation-rule");
const validation_result_1 = require("../../../../domain/value-objects/validation-result");
const error_codes_1 = require("../../../../domain/errors/error-codes");
const promo_code_types_1 = require("../../../../domain/entities/promo-code.types");
class GlobalAmountLimitRule extends validation_rule_1.ValidationRule {
    usageRepo;
    constructor(usageRepo) {
        super();
        this.usageRepo = usageRepo;
    }
    async validate(context) {
        const rule = context.promo?.getRule(promo_code_types_1.RuleType.GLOBAL_AMOUNT_LIMIT);
        if (!rule)
            return validation_result_1.ValidationResult.success();
        const maxTotal = Number(rule.parameters.maxTotalAmount ?? 0);
        const excludeIds = context.order.getOrderContext().currentOrders;
        const total = await this.usageRepo.sumPaidDiscountByCode(context.promo.id, excludeIds);
        if (total >= maxTotal) {
            return validation_result_1.ValidationResult.failure(error_codes_1.ErrorCode.MAXIMUM_DISCOUNT_REACHED);
        }
        return validation_result_1.ValidationResult.success();
    }
}
exports.GlobalAmountLimitRule = GlobalAmountLimitRule;
//# sourceMappingURL=global-amount-limit.rule.js.map