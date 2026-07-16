"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenarioSeeder = void 0;
const in_memory_promo_code_repository_1 = require("../../infrastructure/repositories/in-memory/in-memory-promo-code.repository");
const in_memory_usage_repository_1 = require("../../infrastructure/repositories/in-memory/in-memory-usage.repository");
const in_memory_buyer_repository_1 = require("../../infrastructure/repositories/in-memory/in-memory-buyer.repository");
const in_memory_restricted_user_repository_1 = require("../../infrastructure/repositories/in-memory/in-memory-restricted-user.repository");
class ScenarioSeeder {
    promoCodes = new in_memory_promo_code_repository_1.InMemoryPromoCodeRepository();
    usages = new in_memory_usage_repository_1.InMemoryPromoCodeUsageRepository();
    buyers = new in_memory_buyer_repository_1.InMemoryBuyerRepository();
    restrictedUsers = new in_memory_restricted_user_repository_1.InMemoryRestrictedUserRepository();
    async seedPromoCode(promo) {
        await this.promoCodes.save(promo);
        return this;
    }
    async seedBuyer(buyer) {
        await this.buyers.save(buyer);
        return this;
    }
    async seedUsage(usage) {
        await this.usages.save(usage);
        return this;
    }
    async seedUsages(usages) {
        for (const u of usages) {
            await this.usages.save(u);
        }
        return this;
    }
    async authorize(promoCodeId, buyerId) {
        await this.restrictedUsers.authorize(promoCodeId, buyerId);
        return this;
    }
    reset() {
        this.promoCodes.clear();
        this.usages.clear();
        this.buyers.clear();
        this.restrictedUsers.clear();
    }
}
exports.ScenarioSeeder = ScenarioSeeder;
//# sourceMappingURL=scenario-seeder.js.map