"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoCodeEngine = void 0;
const uuid_1 = require("uuid");
const validation_context_1 = require("../../domain/value-objects/validation-context");
const promo_code_usage_1 = require("../../domain/entities/promo-code-usage");
class PromoCodeEngine {
    validationEngine;
    discountCalculator;
    usageRepo;
    constructor(validationEngine, discountCalculator, usageRepo) {
        this.validationEngine = validationEngine;
        this.discountCalculator = discountCalculator;
        this.usageRepo = usageRepo;
    }
    async validate(promoCodeString, order, buyer) {
        const context = new validation_context_1.ValidationContext(promoCodeString, order, buyer);
        return this.validationEngine.validate(context);
    }
    async validateAndCalculate(promoCodeString, order, buyer) {
        const context = new validation_context_1.ValidationContext(promoCodeString, order, buyer);
        const validation = await this.validationEngine.validate(context);
        if (!validation.isValid || !context.promo) {
            return { validation, calculation: null };
        }
        const calculation = this.discountCalculator.calculate(context.promo, order);
        return { validation, calculation };
    }
    async validateAndApply(promoCodeString, orderId, order, buyer) {
        const result = await this.validateAndCalculate(promoCodeString, order, buyer);
        if (!result.validation.isValid || !result.calculation)
            return result;
        const context = new validation_context_1.ValidationContext(promoCodeString, order, buyer);
        await this.validationEngine.validate(context);
        const usage = new promo_code_usage_1.PromoCodeUsage((0, uuid_1.v4)(), context.promo.id, orderId, buyer.buyerId, result.calculation.discountAmount, false);
        await this.usageRepo.save(usage);
        return result;
    }
}
exports.PromoCodeEngine = PromoCodeEngine;
//# sourceMappingURL=promo-code-engine.js.map