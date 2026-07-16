"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalUsageLimitRule = void 0;
const validation_rule_1 = require("../validation-rule");
const validation_result_1 = require("../../../../domain/value-objects/validation-result");
const error_codes_1 = require("../../../../domain/errors/error-codes");
const promo_code_types_1 = require("../../../../domain/entities/promo-code.types");
class GlobalUsageLimitRule extends validation_rule_1.ValidationRule {
    usageRepo;
    constructor(usageRepo) {
        super();
        this.usageRepo = usageRepo;
    }
    async validate(context) {
        const rule = context.promo?.getRule(promo_code_types_1.RuleType.GLOBAL_USAGE_LIMIT);
        if (!rule)
            return validation_result_1.ValidationResult.success();
        const limit = Number(rule.parameters.limit ?? 0);
        const excludeIds = context.order.getOrderContext().currentOrders;
        const count = await this.usageRepo.countPaidUsesByCode(context.promo.id, excludeIds);
        if (count >= limit) {
            return validation_result_1.ValidationResult.failure(error_codes_1.ErrorCode.USAGE_LIMIT_REACHED);
        }
        return validation_result_1.ValidationResult.success();
    }
}
exports.GlobalUsageLimitRule = GlobalUsageLimitRule;
//# sourceMappingURL=global-usage-limit.rule.js.map