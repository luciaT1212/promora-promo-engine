"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryRestrictedUserRepository = void 0;
class InMemoryRestrictedUserRepository {
    store = new Map();
    async isBuyerAuthorized(promoCodeId, buyerId) {
        return this.store.get(promoCodeId)?.has(buyerId) ?? false;
    }
    async authorize(promoCodeId, buyerId) {
        if (!this.store.has(promoCodeId)) {
            this.store.set(promoCodeId, new Set());
        }
        this.store.get(promoCodeId).add(buyerId);
    }
    clear() {
        this.store.clear();
    }
}
exports.InMemoryRestrictedUserRepository = InMemoryRestrictedUserRepository;
//# sourceMappingURL=in-memory-restricted-user.repository.js.map