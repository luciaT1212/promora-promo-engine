"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExistenceRule = void 0;
const validation_rule_1 = require("../validation-rule");
const validation_result_1 = require("../../../../domain/value-objects/validation-result");
const error_codes_1 = require("../../../../domain/errors/error-codes");
class ExistenceRule extends validation_rule_1.ValidationRule {
    promoRepo;
    constructor(promoRepo) {
        super();
        this.promoRepo = promoRepo;
    }
    async validate(context) {
        const promo = await this.promoRepo.findByCode(context.promoCodeString);
        if (!promo) {
            return validation_result_1.ValidationResult.failure(error_codes_1.ErrorCode.INVALID_CODE);
        }
        context.promo = promo;
        return validation_result_1.ValidationResult.success();
    }
}
exports.ExistenceRule = ExistenceRule;
//# sourceMappingURL=existence.rule.js.map