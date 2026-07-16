"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountStrategyFactory = void 0;
const fixed_discount_strategy_1 = require("../calculation/strategies/fixed-discount.strategy");
const percentage_discount_strategy_1 = require("../calculation/strategies/percentage-discount.strategy");
const tiered_discount_strategy_1 = require("../calculation/strategies/tiered-discount.strategy");
class DiscountStrategyFactory {
    strategies = [
        new fixed_discount_strategy_1.FixedDiscountStrategy(),
        new percentage_discount_strategy_1.PercentageDiscountStrategy(),
        new tiered_discount_strategy_1.TieredDiscountStrategy(),
    ];
    getStrategy(type) {
        const strategy = this.strategies.find((s) => s.canHandle(type));
        if (!strategy) {
            throw new Error(`No discount strategy found for type: ${type}`);
        }
        return strategy;
    }
}
exports.DiscountStrategyFactory = DiscountStrategyFactory;
//# sourceMappingURL=discount-strategy.factory.js.map