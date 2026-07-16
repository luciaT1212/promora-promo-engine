"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestrictedUsageRule = void 0;
const validation_rule_1 = require("../validation-rule");
const validation_result_1 = require("../../../../domain/value-objects/validation-result");
const error_codes_1 = require("../../../../domain/errors/error-codes");
const promo_code_types_1 = require("../../../../domain/entities/promo-code.types");
class RestrictedUsageRule extends validation_rule_1.ValidationRule {
    restrictedRepo;
    constructor(restrictedRepo) {
        super();
        this.restrictedRepo = restrictedRepo;
    }
    async validate(context) {
        const rule = context.promo?.getRule(promo_code_types_1.RuleType.RESTRICTED_USAGE);
        if (!rule)
            return validation_result_1.ValidationResult.success();
        const authorized = await this.restrictedRepo.isBuyerAuthorized(context.promo.id, context.buyer.buyerId);
        if (!authorized) {
            return validation_result_1.ValidationResult.failure(error_codes_1.ErrorCode.RESTRICTED_USAGE);
        }
        return validation_result_1.ValidationResult.success();
    }
}
exports.RestrictedUsageRule = RestrictedUsageRule;
//# sourceMappingURL=restricted-usage.rule.js.map