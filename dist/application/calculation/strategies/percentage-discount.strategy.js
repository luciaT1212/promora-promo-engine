"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PercentageDiscountStrategy = void 0;
const promo_code_types_1 = require("../../../domain/entities/promo-code.types");
class PercentageDiscountStrategy {
    calculate(promo, order) {
        return this.round(order.getSubtotal() * (promo.value / 100));
    }
    canHandle(type) {
        return type === promo_code_types_1.DiscountType.PERCENT;
    }
    round(value) {
        return Math.round(value * 100) / 100;
    }
}
exports.PercentageDiscountStrategy = PercentageDiscountStrategy;
//# sourceMappingURL=percentage-discount.strategy.js.map