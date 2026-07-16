"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPromoCodeRepository = void 0;
class InMemoryPromoCodeRepository {
    store = new Map();
    async findByCode(code) {
        for (const promo of this.store.values()) {
            if (promo.code === code)
                return promo;
        }
        return null;
    }
    async findById(id) {
        return this.store.get(id) ?? null;
    }
    async save(promoCode) {
        this.store.set(promoCode.id, promoCode);
    }
    clear() {
        this.store.clear();
    }
}
exports.InMemoryPromoCodeRepository = InMemoryPromoCodeRepository;
//# sourceMappingURL=in-memory-promo-code.repository.js.map