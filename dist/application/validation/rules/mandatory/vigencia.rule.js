"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VigenciaRule = void 0;
const validation_rule_1 = require("../validation-rule");
const validation_result_1 = require("../../../../domain/value-objects/validation-result");
const error_codes_1 = require("../../../../domain/errors/error-codes");
class VigenciaRule extends validation_rule_1.ValidationRule {
    async validate(context) {
        if (!context.promo) {
            return validation_result_1.ValidationResult.failure(error_codes_1.ErrorCode.INVALID_CODE);
        }
        if (context.promo.isExpired()) {
            return validation_result_1.ValidationResult.failure(error_codes_1.ErrorCode.EXPIRED_COUPON);
        }
        return validation_result_1.ValidationResult.success();
    }
}
exports.VigenciaRule = VigenciaRule;
//# sourceMappingURL=vigencia.rule.js.map