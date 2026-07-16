"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoCodeFactory = void 0;
const uuid_1 = require("uuid");
const promo_code_1 = require("../../domain/entities/promo-code");
const promo_code_types_1 = require("../../domain/entities/promo-code.types");
class PromoCodeFactory {
    static create(overrides = {}) {
        const now = new Date();
        const oneMonthAhead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return new promo_code_1.PromoCode(overrides.id ?? (0, uuid_1.v4)(), overrides.code ?? `TEST-${Math.floor(Math.random() * 10000)}`, overrides.type ?? promo_code_types_1.DiscountType.PERCENT, overrides.value ?? 10, overrides.state ?? promo_code_types_1.PromoState.ACTIVE, overrides.startDate ?? oneMonthAgo, overrides.endDate ?? oneMonthAhead, overrides.rules ?? [], overrides.postCalcRules ?? [], overrides.tiers ?? []);
    }
    static fixed(value, over = {}) {
        return this.create({ ...over, type: promo_code_types_1.DiscountType.FIXED, value });
    }
    static percent(value, over = {}) {
        return this.create({ ...over, type: promo_code_types_1.DiscountType.PERCENT, value });
    }
    static tiered(tiers, over = {}) {
        return this.create({ ...over, type: promo_code_types_1.DiscountType.TIERED, value: 0, tiers });
    }
    static draft(over = {}) {
        return this.create({ ...over, state: promo_code_types_1.PromoState.DRAFT });
    }
    static paused(over = {}) {
        return this.create({ ...over, state: promo_code_types_1.PromoState.PAUSED });
    }
    static expiredByDate(over = {}) {
        const past = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
        const morePast = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
        return this.create({ ...over, startDate: morePast, endDate: past });
    }
    static notYetActive(over = {}) {
        const future = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
        const moreFuture = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);
        return this.create({ ...over, startDate: future, endDate: moreFuture });
    }
}
exports.PromoCodeFactory = PromoCodeFactory;
//# sourceMappingURL=promo-code.factory.js.map