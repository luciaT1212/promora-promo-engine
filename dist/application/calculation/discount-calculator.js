"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountCalculator = void 0;
const max_discount_amount_rule_1 = require("./post-rules/max-discount-amount.rule");
class DiscountCalculator {
    strategyFactory;
    maxDiscountRule;
    constructor(strategyFactory, maxDiscountRule = new max_discount_amount_rule_1.MaxDiscountAmountRule()) {
        this.strategyFactory = strategyFactory;
        this.maxDiscountRule = maxDiscountRule;
    }
    calculate(promo, order) {
        const strategy = this.strategyFactory.getStrategy(promo.type);
        const rawDiscount = strategy.calculate(promo, order);
        const finalDiscount = this.maxDiscountRule.apply(promo, rawDiscount);
        const subtotal = order.getSubtotal();
        return {
            originalAmount: subtotal,
            discountAmount: finalDiscount,
            finalAmount: Math.max(0, subtotal - finalDiscount),
        };
    }
}
exports.DiscountCalculator = DiscountCalculator;
//# sourceMappingURL=discount-calculator.js.map