"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoRule = void 0;
class PromoRule {
    ruleType;
    parameters;
    isActive;
    constructor(ruleType, parameters, isActive = true) {
        this.ruleType = ruleType;
        this.parameters = parameters;
        this.isActive = isActive;
    }
}
exports.PromoRule = PromoRule;
//# sourceMappingURL=promo-rule.js.map