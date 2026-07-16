"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedDiscountStrategy = void 0;
const promo_code_types_1 = require("../../../domain/entities/promo-code.types");
class FixedDiscountStrategy {
    calculate(promo, order) {
        return Math.min(promo.value, order.getSubtotal());
    }
    canHandle(type) {
        return type === promo_code_types_1.DiscountType.FIXED;
    }
}
exports.FixedDiscountStrategy = FixedDiscountStrategy;
//# sourceMappingURL=fixed-discount.strategy.js.map