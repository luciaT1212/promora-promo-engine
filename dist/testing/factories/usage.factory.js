"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageFactory = void 0;
const uuid_1 = require("uuid");
const promo_code_usage_1 = require("../../domain/entities/promo-code-usage");
class UsageFactory {
    static create(overrides = {}) {
        return new promo_code_usage_1.PromoCodeUsage(overrides.id ?? (0, uuid_1.v4)(), overrides.promoCodeId ?? (0, uuid_1.v4)(), overrides.orderId ?? (0, uuid_1.v4)(), overrides.buyerId ?? (0, uuid_1.v4)(), overrides.discountAmount ?? 10, overrides.isPaid ?? true, overrides.createdAt ?? new Date());
    }
    static unpaid(overrides = {}) {
        return this.create({ ...overrides, isPaid: false });
    }
}
exports.UsageFactory = UsageFactory;
//# sourceMappingURL=usage.factory.js.map