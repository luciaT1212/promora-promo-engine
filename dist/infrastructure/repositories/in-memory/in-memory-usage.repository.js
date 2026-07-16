"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPromoCodeUsageRepository = void 0;
class InMemoryPromoCodeUsageRepository {
    store = [];
    async save(usage) {
        this.store.push(usage);
    }
    async countPaidUsesByCode(promoCodeId, excludeOrderIds = []) {
        return this.store.filter((u) => u.promoCodeId === promoCodeId &&
            u.isPaid &&
            !excludeOrderIds.includes(u.orderId)).length;
    }
    async countPaidUsesByCodeAndBuyer(promoCodeId, buyerId, excludeOrderIds = []) {
        return this.store.filter((u) => u.promoCodeId === promoCodeId &&
            u.buyerId === buyerId &&
            u.isPaid &&
            !excludeOrderIds.includes(u.orderId)).length;
    }
    async sumPaidDiscountByCode(promoCodeId, excludeOrderIds = []) {
        return this.store
            .filter((u) => u.promoCodeId === promoCodeId &&
            u.isPaid &&
            !excludeOrderIds.includes(u.orderId))
            .reduce((sum, u) => sum + u.discountAmount, 0);
    }
    clear() {
        this.store.length = 0;
    }
}
exports.InMemoryPromoCodeUsageRepository = InMemoryPromoCodeUsageRepository;
//# sourceMappingURL=in-memory-usage.repository.js.map