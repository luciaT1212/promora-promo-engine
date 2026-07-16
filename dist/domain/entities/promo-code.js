"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoCode = void 0;
const promo_code_types_1 = require("./promo-code.types");
class PromoCode {
    id;
    code;
    type;
    value;
    state;
    startDate;
    endDate;
    rules;
    postCalcRules;
    tiers;
    constructor(id, code, type, value, state, startDate, endDate, rules = [], postCalcRules = [], tiers = []) {
        this.id = id;
        this.code = code;
        this.type = type;
        this.value = value;
        this.state = state;
        this.startDate = startDate;
        this.endDate = endDate;
        this.rules = rules;
        this.postCalcRules = postCalcRules;
        this.tiers = tiers;
    }
    isActive() {
        return this.state === promo_code_types_1.PromoState.ACTIVE;
    }
    isExpired(now = new Date()) {
        return now < this.startDate || now > this.endDate;
    }
    getRule(ruleType) {
        return this.rules.find((r) => r.ruleType === ruleType && r.isActive);
    }
    hasRule(ruleType) {
        return this.getRule(ruleType) !== undefined;
    }
    getActiveRules() {
        return this.rules.filter((r) => r.isActive);
    }
}
exports.PromoCode = PromoCode;
//# sourceMappingURL=promo-code.js.map