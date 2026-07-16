"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TieredDiscountStrategy = void 0;
const promo_code_types_1 = require("../../../domain/entities/promo-code.types");
class TieredDiscountStrategy {
    calculate(promo, order) {
        const totalOrders = order.getOrderContext().buyerProfile.totalOrders;
        const eligibleTier = this.findEligibleTier(promo.tiers, totalOrders);
        if (!eligibleTier)
            return 0;
        return this.round(order.getSubtotal() * (eligibleTier.discountPercent / 100));
    }
    canHandle(type) {
        return type === promo_code_types_1.DiscountType.TIERED;
    }
    findEligibleTier(tiers, totalOrders) {
        const eligible = tiers.filter((t) => t.minOrders <= totalOrders);
        if (eligible.length === 0)
            return null;
        return eligible.reduce((max, t) => t.minOrders > max.minOrders ? t : max);
    }
    round(value) {
        return Math.round(value * 100) / 100;
    }
}
exports.TieredDiscountStrategy = TieredDiscountStrategy;
//# sourceMappingURL=tiered-discount.strategy.js.map