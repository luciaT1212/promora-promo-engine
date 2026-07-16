"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryBuyerRepository = void 0;
class InMemoryBuyerRepository {
    store = new Map();
    async findById(buyerId) {
        return this.store.get(buyerId) ?? null;
    }
    async save(profile) {
        this.store.set(profile.buyerId, profile);
    }
    clear() {
        this.store.clear();
    }
}
exports.InMemoryBuyerRepository = InMemoryBuyerRepository;
//# sourceMappingURL=in-memory-buyer.repository.js.map