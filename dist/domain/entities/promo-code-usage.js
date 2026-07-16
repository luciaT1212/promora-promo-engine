"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoCodeUsage = void 0;
class PromoCodeUsage {
    id;
    promoCodeId;
    orderId;
    buyerId;
    discountAmount;
    isPaid;
    createdAt;
    constructor(id, promoCodeId, orderId, buyerId, discountAmount, isPaid, createdAt = new Date()) {
        this.id = id;
        this.promoCodeId = promoCodeId;
        this.orderId = orderId;
        this.buyerId = buyerId;
        this.discountAmount = discountAmount;
        this.isPaid = isPaid;
        this.createdAt = createdAt;
    }
}
exports.PromoCodeUsage = PromoCodeUsage;
//# sourceMappingURL=promo-code-usage.js.map