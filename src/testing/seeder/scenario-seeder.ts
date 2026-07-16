import { InMemoryPromoCodeRepository } from '../../infrastructure/repositories/in-memory/in-memory-promo-code.repository';
import { InMemoryPromoCodeUsageRepository } from '../../infrastructure/repositories/in-memory/in-memory-usage.repository';
import { InMemoryBuyerRepository } from '../../infrastructure/repositories/in-memory/in-memory-buyer.repository';
import { InMemoryRestrictedUserRepository } from '../../infrastructure/repositories/in-memory/in-memory-restricted-user.repository';
import { PromoCode } from '../../domain/entities/promo-code';
import { PromoCodeUsage } from '../../domain/entities/promo-code-usage';
import { BuyerProfile } from '../../domain/entities/buyer-profile';

export class ScenarioSeeder {
  readonly promoCodes = new InMemoryPromoCodeRepository();
  readonly usages = new InMemoryPromoCodeUsageRepository();
  readonly buyers = new InMemoryBuyerRepository();
  readonly restrictedUsers = new InMemoryRestrictedUserRepository();

  async seedPromoCode(promo: PromoCode): Promise<this> {
    await this.promoCodes.save(promo);
    return this;
  }

  async seedBuyer(buyer: BuyerProfile): Promise<this> {
    await this.buyers.save(buyer);
    return this;
  }

  async seedUsage(usage: PromoCodeUsage): Promise<this> {
    await this.usages.save(usage);
    return this;
  }

  async seedUsages(usages: readonly PromoCodeUsage[]): Promise<this> {
    for (const u of usages) {
      await this.usages.save(u);
    }
    return this;
  }

  async authorize(promoCodeId: string, buyerId: string): Promise<this> {
    await this.restrictedUsers.authorize(promoCodeId, buyerId);
    return this;
  }

  reset(): void {
    this.promoCodes.clear();
    this.usages.clear();
    this.buyers.clear();
    this.restrictedUsers.clear();
  }
}
