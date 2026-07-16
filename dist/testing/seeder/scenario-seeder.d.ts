import { InMemoryPromoCodeRepository } from '../../infrastructure/repositories/in-memory/in-memory-promo-code.repository';
import { InMemoryPromoCodeUsageRepository } from '../../infrastructure/repositories/in-memory/in-memory-usage.repository';
import { InMemoryBuyerRepository } from '../../infrastructure/repositories/in-memory/in-memory-buyer.repository';
import { InMemoryRestrictedUserRepository } from '../../infrastructure/repositories/in-memory/in-memory-restricted-user.repository';
import { PromoCode } from '../../domain/entities/promo-code';
import { PromoCodeUsage } from '../../domain/entities/promo-code-usage';
import { BuyerProfile } from '../../domain/entities/buyer-profile';
export declare class ScenarioSeeder {
    readonly promoCodes: InMemoryPromoCodeRepository;
    readonly usages: InMemoryPromoCodeUsageRepository;
    readonly buyers: InMemoryBuyerRepository;
    readonly restrictedUsers: InMemoryRestrictedUserRepository;
    seedPromoCode(promo: PromoCode): Promise<this>;
    seedBuyer(buyer: BuyerProfile): Promise<this>;
    seedUsage(usage: PromoCodeUsage): Promise<this>;
    seedUsages(usages: readonly PromoCodeUsage[]): Promise<this>;
    authorize(promoCodeId: string, buyerId: string): Promise<this>;
    reset(): void;
}
